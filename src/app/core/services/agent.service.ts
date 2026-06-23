import { Injectable, inject, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { GeminiService, type AgentPlan } from './gemini.service';
import {
  SupabaseService,
  type DbAgentActivityLog,
  type DbAgentConfig,
  type DbAgentTask,
} from './supabase.service';

export interface AgentExecutionResult {
  success: boolean;
  action: string;
  details: Record<string, unknown>;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);
  private readonly gemini = inject(GeminiService);

  readonly isRunning = signal(false);
  readonly lastRunResult = signal<AgentExecutionResult | null>(null);
  readonly pendingTasks = signal<DbAgentTask[]>([]);
  readonly activityLogs = signal<DbAgentActivityLog[]>([]);

  async getAgentConfig(agentId: string): Promise<DbAgentConfig | null> {
    return this.supabase.getAgentConfig(agentId);
  }

  async createDefaultConfig(agentId: string): Promise<boolean> {
    return this.supabase.createAgentConfig({
      agent_id: agentId,
      max_projects_per_month: environment.agentConfig.maxProjectsPerMonth,
      max_issues_per_month: 10,
      max_prs_per_month: 5,
      allowed_actions: ['create_project', 'create_issue', 'create_pr', 'analyze_repo'],
      quiet_hours_start: environment.agentConfig.quietHoursStart,
      quiet_hours_end: environment.agentConfig.quietHoursEnd,
      auto_approve: false,
    });
  }

  async updateConfig(agentId: string, updates: Partial<DbAgentConfig>): Promise<boolean> {
    return this.supabase.updateAgentConfig(agentId, updates);
  }

  async checkLimits(agentId: string, action: string): Promise<boolean> {
    return this.supabase.checkAgentLimits(agentId, action);
  }

  async getMonthlyCount(agentId: string, action: string): Promise<number> {
    return this.supabase.getAgentMonthlyCount(agentId, action);
  }

  async executeAgentAction(agentId: string): Promise<AgentExecutionResult> {
    if (this.isRunning()) {
      return { success: false, action: 'none', details: {}, error: 'Already running' };
    }

    this.isRunning.set(true);
    this.lastRunResult.set(null);

    try {
      // 1. Get agent info
      const agents = await this.supabase.getUserAgents(this.auth.user()?.id ?? '');

      const agent = agents.find((a) => a.id === agentId);

      if (!agent) {
        throw new Error('Agent not found');
      }

      // 2. Get or create config
      let config = await this.getAgentConfig(agentId);

      if (!config) {
        const created = await this.createDefaultConfig(agentId);

        if (!created) throw new Error('Failed to create agent config');
        config = await this.getAgentConfig(agentId);
      }

      if (!config) {
        throw new Error('Agent config not found');
      }

      // 3. Check auto-approve
      if (!config.auto_approve) {
        return {
          success: false,
          action: 'none',
          details: {},
          error: 'Auto-approve is disabled. Enable it in agent settings.',
        };
      }

      // 4. Get context
      const projectCount = await this.getMonthlyCount(agentId, 'create_project');

      const issueCount = await this.getMonthlyCount(agentId, 'create_issue');

      const prCount = await this.getMonthlyCount(agentId, 'create_pr');

      const repos = await this.supabase.getGeneratedRepos();

      const reposList = repos
        .map((r) => `- ${r.owner}/${r.name}: ${r.description} [${r.language}]`)
        .join('\n');

      // 5. Plan action
      const apiKey = agent.api_key || environment.geminiDefaultKey;

      if (!apiKey) {
        throw new Error('No API key available');
      }

      const plan = await this.gemini.planAgentAction(agent.agent_name, apiKey, {
        projectCount,
        maxProjects: config.max_projects_per_month,
        issueCount,
        maxIssues: config.max_issues_per_month,
        prCount,
        maxPRs: config.max_prs_per_month,
        existingRepos: reposList,
        allowedActions: config.allowed_actions,
      });

      // 6. Check limits for planned action
      const canExecute = await this.checkLimits(agentId, plan.action);

      if (!canExecute) {
        return {
          success: false,
          action: plan.action,
          details: { plan },
          error: `Limit reached for ${plan.action}`,
        };
      }

      // 7. Create task
      const task = await this.supabase.createAgentTask({
        agent_id: agentId,
        type: plan.action,
        status: 'pending',
        payload: plan as unknown as Record<string, unknown>,
        priority: 0,
      });

      if (!task?.id) {
        throw new Error('Failed to create task');
      }

      // 8. Execute action
      let result: AgentExecutionResult;

      switch (plan.action) {
        case 'create_project':
          result = await this.executeCreateProject(
            agentId,
            agent.agent_name,
            apiKey,
            plan,
            task.id,
          );
          break;
        case 'create_issue':
          result = await this.executeCreateIssue(agentId, agent.agent_name, apiKey, plan, task.id);
          break;
        case 'create_pr':
          result = await this.executeCreatePR(agentId, agent.agent_name, apiKey, plan, task.id);
          break;
        case 'analyze_repo':
          result = await this.executeAnalyzeRepo(agentId, agent.agent_name, apiKey, plan, task.id);
          break;
        default:
          throw new Error(`Unknown action: ${plan.action}`);
      }

      this.lastRunResult.set(result);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      const result: AgentExecutionResult = {
        success: false,
        action: 'unknown',
        details: {},
        error: message,
      };

      this.lastRunResult.set(result);

      return result;
    } finally {
      this.isRunning.set(false);
    }
  }

  private async executeCreateProject(
    agentId: string,
    agentName: string,
    apiKey: string,
    plan: AgentPlan,
    taskId: string,
  ): Promise<AgentExecutionResult> {
    // Update task status
    await this.supabase.updateAgentTask(taskId, {
      status: 'running',
      started_at: new Date().toISOString(),
    });

    try {
      const project = await this.gemini.createFullProject(agentName, apiKey, plan.topic);

      // Insert repo
      const repoData = {
        owner: agentName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        name: project.name,
        description: project.description,
        language: project.language,
        language_color: project.languageColor,
        stars: Math.floor(Math.random() * 100) + 10,
        forks: Math.floor(Math.random() * 20) + 1,
        stars_today: Math.floor(Math.random() * 10) + 1,
        watch: Math.floor(Math.random() * 50) + 5,
        topics: project.topics,
        license: 'MIT',
        default_branch: 'main',
        template: '',
        files: project.files.map((f) => ({ name: f.path, type: 'file', content: f.content })),
      };

      const success = await this.supabase.insertGeneratedRepo(repoData);

      // Log activity
      await this.supabase.createActivityLog({
        agent_id: agentId,
        task_id: taskId,
        action: 'create_project',
        target_type: 'repo',
        details: { repo_name: project.name, topic: plan.topic },
      });

      // Update task
      await this.supabase.updateAgentTask(taskId, {
        status: success ? 'completed' : 'failed',
        result: { project },
        completed_at: new Date().toISOString(),
      });

      if (success) {
        toast.success(`Project "${project.name}" created!`);
      }

      return { success, action: 'create_project', details: { project } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await this.supabase.updateAgentTask(taskId, {
        status: 'failed',
        error_message: message,
        completed_at: new Date().toISOString(),
      });

      return { success: false, action: 'create_project', details: {}, error: message };
    }
  }

  private async executeCreateIssue(
    agentId: string,
    agentName: string,
    apiKey: string,
    plan: AgentPlan,
    taskId: string,
  ): Promise<AgentExecutionResult> {
    await this.supabase.updateAgentTask(taskId, {
      status: 'running',
      started_at: new Date().toISOString(),
    });

    try {
      const [owner, name] = (plan.targetRepo || '').split('/');

      if (!owner || !name) throw new Error('Invalid target repo format');

      const repos = await this.supabase.getGeneratedRepos();

      const targetRepo = repos.find((r) => r.owner === owner && r.name === name);

      if (!targetRepo) {
        throw new Error(`Repo ${plan.targetRepo} not found`);
      }

      const issue = await this.gemini.createIssue(agentName, apiKey, name, targetRepo.description);

      // Get next issue number
      const existingIssues = await this.supabase.getRepoIssues(targetRepo.id!);

      const nextNumber = existingIssues.length
        ? Math.max(...existingIssues.map((i) => i.number)) + 1
        : 1;

      const result = await this.supabase.createAgentIssue({
        repo_id: targetRepo.id!,
        number: nextNumber,
        title: issue.title,
        body: issue.body,
        state: 'open',
        author_agent_id: agentId,
        labels: issue.labels || [],
        comments_count: 0,
      });

      await this.supabase.createActivityLog({
        agent_id: agentId,
        task_id: taskId,
        action: 'create_issue',
        target_type: 'issue',
        target_id: result?.id,
        details: { repo: plan.targetRepo, title: issue.title, number: nextNumber },
      });

      await this.supabase.updateAgentTask(taskId, {
        status: result ? 'completed' : 'failed',
        result: { issue: result },
        completed_at: new Date().toISOString(),
      });

      if (result) {
        toast.success(`Issue #${nextNumber} created in ${plan.targetRepo}!`);
      }

      return { success: !!result, action: 'create_issue', details: { issue: result } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await this.supabase.updateAgentTask(taskId, {
        status: 'failed',
        error_message: message,
        completed_at: new Date().toISOString(),
      });

      return { success: false, action: 'create_issue', details: {}, error: message };
    }
  }

  private async executeCreatePR(
    agentId: string,
    agentName: string,
    apiKey: string,
    plan: AgentPlan,
    taskId: string,
  ): Promise<AgentExecutionResult> {
    await this.supabase.updateAgentTask(taskId, {
      status: 'running',
      started_at: new Date().toISOString(),
    });

    try {
      const [owner, name] = (plan.targetRepo || '').split('/');

      if (!owner || !name) throw new Error('Invalid target repo format');

      const repos = await this.supabase.getGeneratedRepos();

      const targetRepo = repos.find((r) => r.owner === owner && r.name === name);

      if (!targetRepo) {
        throw new Error(`Repo ${plan.targetRepo} not found`);
      }

      const pr = await this.gemini.createPullRequest(
        agentName,
        apiKey,
        name,
        targetRepo.description,
      );

      // Get next PR number
      const existingPRs = await this.supabase.getRepoPullRequests(targetRepo.id!);

      const nextNumber = existingPRs.length ? Math.max(...existingPRs.map((p) => p.number)) + 1 : 1;

      const result = await this.supabase.createAgentPR({
        repo_id: targetRepo.id!,
        number: nextNumber,
        title: pr.title,
        body: pr.body,
        state: 'open',
        author_agent_id: agentId,
        head_branch: `agent-${agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        base_branch: 'main',
        changes: pr.changes || {},
        review_status: 'pending',
      });

      await this.supabase.createActivityLog({
        agent_id: agentId,
        task_id: taskId,
        action: 'create_pr',
        target_type: 'pr',
        target_id: result?.id,
        details: { repo: plan.targetRepo, title: pr.title, number: nextNumber },
      });

      await this.supabase.updateAgentTask(taskId, {
        status: result ? 'completed' : 'failed',
        result: { pr: result },
        completed_at: new Date().toISOString(),
      });

      if (result) {
        toast.success(`PR #${nextNumber} created in ${plan.targetRepo}!`);
      }

      return { success: !!result, action: 'create_pr', details: { pr: result } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await this.supabase.updateAgentTask(taskId, {
        status: 'failed',
        error_message: message,
        completed_at: new Date().toISOString(),
      });

      return { success: false, action: 'create_pr', details: {}, error: message };
    }
  }

  private async executeAnalyzeRepo(
    agentId: string,
    agentName: string,
    apiKey: string,
    plan: AgentPlan,
    taskId: string,
  ): Promise<AgentExecutionResult> {
    await this.supabase.updateAgentTask(taskId, {
      status: 'running',
      started_at: new Date().toISOString(),
    });

    try {
      const [owner, name] = (plan.targetRepo || '').split('/');

      if (!owner || !name) throw new Error('Invalid target repo format');

      const repos = await this.supabase.getGeneratedRepos();

      const targetRepo = repos.find((r) => r.owner === owner && r.name === name);

      if (!targetRepo) {
        throw new Error(`Repo ${plan.targetRepo} not found`);
      }

      const analysis = await this.gemini.analyzeAndImprove(
        agentName,
        apiKey,
        name,
        targetRepo.description,
      );

      await this.supabase.createActivityLog({
        agent_id: agentId,
        task_id: taskId,
        action: 'analyze_repo',
        target_type: 'repo',
        target_id: targetRepo.id,
        details: { repo: plan.targetRepo, suggestions: analysis.suggestions?.length || 0 },
      });

      await this.supabase.updateAgentTask(taskId, {
        status: 'completed',
        result: { analysis },
        completed_at: new Date().toISOString(),
      });

      toast.success(`Analysis complete for ${plan.targetRepo}!`);

      return { success: true, action: 'analyze_repo', details: { analysis } };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await this.supabase.updateAgentTask(taskId, {
        status: 'failed',
        error_message: message,
        completed_at: new Date().toISOString(),
      });

      return { success: false, action: 'analyze_repo', details: {}, error: message };
    }
  }

  async loadPendingTasks(agentId: string): Promise<void> {
    const tasks = await this.supabase.getAgentTasks(agentId);

    this.pendingTasks.set(tasks.filter((t) => t.status === 'pending' || t.status === 'running'));
  }

  async loadActivityLogs(agentId: string): Promise<void> {
    const logs = await this.supabase.getAgentActivityLogs(agentId);

    this.activityLogs.set(logs);
  }

  async runAllAgents(): Promise<void> {
    const result = await this.supabase.runAgentRunner();

    if (result.processed > 0) {
      toast.success(`Processed ${result.processed} agent(s)`);
    }
    if (result.errors > 0) {
      toast.error(`${result.errors} agent(s) failed`);
    }
  }
}
