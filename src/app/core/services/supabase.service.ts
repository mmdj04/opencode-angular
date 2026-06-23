import { Injectable } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface DbArticle {
  id?: string;
  slug: string;
  title: string;
  snippet: string;
  subtitle: string;
  source: string;
  source_url: string;
  date: string;
  read_time: string;
  category: string;
  category_label: string;
  author_name: string;
  author_avatar: string;
  image_url: string;
  paragraphs: { text: string; isSubtitle?: boolean }[];
  diagrams: { type: string; code: string; caption: string }[];
  tags: string[];
  time?: string;
  created_at?: string;
}

export interface DbGeneratedRepo {
  id?: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  language_color: string;
  stars: number;
  forks: number;
  stars_today: number;
  watch: number;
  topics: string[];
  license: string;
  default_branch: string;
  template: string;
  files: { name: string; type: string; content: string }[];
  created_at?: string;
}

export interface DbUserAgent {
  id?: string;
  user_id: string;
  agent_name: string;
  api_key: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface DbDeveloperProfile {
  id?: string;
  username: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  avatar_color: string;
  followers: number;
  following: number;
  top_languages: { name: string; color: string; percentage: number }[];
  pinned_repos: {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updated: string;
  }[];
  repos: {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updated: string;
  }[];
  popular_repo: { name: string; description: string };
  created_at?: string;
}

export interface DbAgentTask {
  id?: string;
  agent_id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  priority: number;
  error_message?: string;
  created_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface DbAgentActivityLog {
  id?: string;
  agent_id: string;
  task_id?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  created_at?: string;
}

export interface DbAgentConfig {
  id?: string;
  agent_id: string;
  max_projects_per_month: number;
  max_issues_per_month: number;
  max_prs_per_month: number;
  allowed_actions: string[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  auto_approve: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbAgentIssue {
  id?: string;
  repo_id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author_agent_id: string;
  labels: string[];
  assignee_agent_id?: string;
  comments_count: number;
  created_at?: string;
  closed_at?: string;
}

export interface DbAgentPullRequest {
  id?: string;
  repo_id: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  author_agent_id: string;
  head_branch: string;
  base_branch: string;
  changes: Record<string, string>;
  review_status: 'pending' | 'approved' | 'changes_requested';
  created_at?: string;
  merged_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getArticles(): Promise<DbArticle[]> {
    const { data, error } = await this.supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);

      return [];
    }

    return data ?? [];
  }

  async getArticleBySlug(slug: string): Promise<DbArticle | null> {
    const { data, error } = await this.supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching article:', error);

      return null;
    }

    return data;
  }

  async insertArticles(articles: DbArticle[]): Promise<boolean> {
    const { error } = await this.supabase.from('news_articles').insert(articles);

    if (error) {
      console.error('Error inserting articles:', error);

      return false;
    }

    return true;
  }

  async clearGemmaArticles(): Promise<boolean> {
    const { data: ids, error: fetchError } = await this.supabase.from('news_articles').select('id');

    if (fetchError) {
      console.error('Error fetching article IDs:', fetchError);

      return false;
    }

    if (!ids || ids.length === 0) return true;

    const idList = ids.map((r: { id: string }) => r.id);

    const { error } = await this.supabase.from('news_articles').delete().in('id', idList);

    if (error) {
      console.error('Error clearing articles:', error);

      return false;
    }

    return true;
  }

  async insertGeneratedRepo(repo: DbGeneratedRepo): Promise<boolean> {
    const { error } = await this.supabase.from('generated_repos').insert(repo);

    if (error) {
      console.error('Error inserting generated repo:', error);

      return false;
    }

    return true;
  }

  async getGeneratedRepos(): Promise<DbGeneratedRepo[]> {
    const { data, error } = await this.supabase
      .from('generated_repos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching generated repos:', error);

      return [];
    }

    return data ?? [];
  }

  async getGeneratedRepoByOwnerAndName(
    owner: string,
    name: string,
  ): Promise<DbGeneratedRepo | null> {
    const { data, error } = await this.supabase
      .from('generated_repos')
      .select('*')
      .eq('owner', owner)
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching generated repo:', error);

      return null;
    }

    return data;
  }

  async insertDeveloperProfile(profile: DbDeveloperProfile): Promise<boolean> {
    const { error } = await this.supabase.from('developer_profiles').insert(profile);

    if (error) {
      console.error('Error inserting developer profile:', error);

      return false;
    }

    return true;
  }

  async getDeveloperProfiles(): Promise<DbDeveloperProfile[]> {
    const { data, error } = await this.supabase
      .from('developer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching developer profiles:', error);

      return [];
    }

    return data ?? [];
  }

  async getDeveloperProfileByUsername(username: string): Promise<DbDeveloperProfile | null> {
    const { data, error } = await this.supabase
      .from('developer_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching developer profile:', error);

      return null;
    }

    return data;
  }

  async getUserAgents(userId: string): Promise<DbUserAgent[]> {
    const { data, error } = await this.supabase
      .from('user_agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user agents:', error);

      return [];
    }

    return data ?? [];
  }

  async insertUserAgent(agent: DbUserAgent): Promise<boolean> {
    const { error } = await this.supabase.from('user_agents').insert(agent);

    if (error) {
      console.error('Error inserting user agent:', error);

      return false;
    }

    return true;
  }

  async updateUserAgent(id: string, updates: Partial<DbUserAgent>): Promise<boolean> {
    const { error } = await this.supabase.from('user_agents').update(updates).eq('id', id);

    if (error) {
      console.error('Error updating user agent:', error);

      return false;
    }

    return true;
  }

  async deleteUserAgent(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('user_agents').delete().eq('id', id);

    if (error) {
      console.error('Error deleting user agent:', error);

      return false;
    }

    return true;
  }

  async countUserAgents(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('user_agents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error counting user agents:', error);

      return 0;
    }

    return count ?? 0;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('developer_profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Error checking username:', error);

      return false;
    }

    return !!data;
  }

  // ===========================================
  // Agent Tasks
  // ===========================================

  async getAgentTasks(agentId: string): Promise<DbAgentTask[]> {
    const { data, error } = await this.supabase
      .from('agent_tasks')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agent tasks:', error);

      return [];
    }

    return data ?? [];
  }

  async getPendingTasks(): Promise<DbAgentTask[]> {
    const { data, error } = await this.supabase
      .from('agent_tasks')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending tasks:', error);

      return [];
    }

    return data ?? [];
  }

  async createAgentTask(task: Omit<DbAgentTask, 'id' | 'created_at'>): Promise<DbAgentTask | null> {
    const { data, error } = await this.supabase.from('agent_tasks').insert(task).select().single();

    if (error) {
      console.error('Error creating agent task:', error);

      return null;
    }

    return data;
  }

  async updateAgentTask(id: string, updates: Partial<DbAgentTask>): Promise<boolean> {
    const { error } = await this.supabase.from('agent_tasks').update(updates).eq('id', id);

    if (error) {
      console.error('Error updating agent task:', error);

      return false;
    }

    return true;
  }

  // ===========================================
  // Agent Activity Logs
  // ===========================================

  async getAgentActivityLogs(agentId: string, limit = 50): Promise<DbAgentActivityLog[]> {
    const { data, error } = await this.supabase
      .from('agent_activity_logs')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs:', error);

      return [];
    }

    return data ?? [];
  }

  async getAllActivityLogs(limit = 100): Promise<DbAgentActivityLog[]> {
    const { data, error } = await this.supabase
      .from('agent_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching all activity logs:', error);

      return [];
    }

    return data ?? [];
  }

  async createActivityLog(log: Omit<DbAgentActivityLog, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await this.supabase.from('agent_activity_logs').insert(log);

    if (error) {
      console.error('Error creating activity log:', error);

      return false;
    }

    return true;
  }

  // ===========================================
  // Agent Config
  // ===========================================

  async getAgentConfig(agentId: string): Promise<DbAgentConfig | null> {
    const { data, error } = await this.supabase
      .from('agent_config')
      .select('*')
      .eq('agent_id', agentId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching agent config:', error);

      return null;
    }

    return data;
  }

  async createAgentConfig(
    config: Omit<DbAgentConfig, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<boolean> {
    const { error } = await this.supabase.from('agent_config').insert(config);

    if (error) {
      console.error('Error creating agent config:', error);

      return false;
    }

    return true;
  }

  async updateAgentConfig(agentId: string, updates: Partial<DbAgentConfig>): Promise<boolean> {
    const { error } = await this.supabase
      .from('agent_config')
      .update(updates)
      .eq('agent_id', agentId);

    if (error) {
      console.error('Error updating agent config:', error);

      return false;
    }

    return true;
  }

  async checkAgentLimits(agentId: string, action: string): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('check_agent_limits', {
      p_agent_id: agentId,
      p_action: action,
    });

    if (error) {
      console.error('Error checking agent limits:', error);

      return false;
    }

    return data as boolean;
  }

  async getAgentMonthlyCount(agentId: string, action: string): Promise<number> {
    const { data, error } = await this.supabase.rpc('get_agent_monthly_count', {
      p_agent_id: agentId,
      p_action: action,
    });

    if (error) {
      console.error('Error getting monthly count:', error);

      return 0;
    }

    return (data as number) ?? 0;
  }

  // ===========================================
  // Agent Issues
  // ===========================================

  async getRepoIssues(repoId: string): Promise<DbAgentIssue[]> {
    const { data, error } = await this.supabase
      .from('agent_issues')
      .select('*')
      .eq('repo_id', repoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repo issues:', error);

      return [];
    }

    return data ?? [];
  }

  async createAgentIssue(
    issue: Omit<DbAgentIssue, 'id' | 'created_at'>,
  ): Promise<DbAgentIssue | null> {
    const { data, error } = await this.supabase
      .from('agent_issues')
      .insert(issue)
      .select()
      .single();

    if (error) {
      console.error('Error creating agent issue:', error);

      return null;
    }

    return data;
  }

  async closeAgentIssue(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('agent_issues')
      .update({ state: 'closed', closed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error closing agent issue:', error);

      return false;
    }

    return true;
  }

  // ===========================================
  // Agent Pull Requests
  // ===========================================

  async getRepoPullRequests(repoId: string): Promise<DbAgentPullRequest[]> {
    const { data, error } = await this.supabase
      .from('agent_pull_requests')
      .select('*')
      .eq('repo_id', repoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repo PRs:', error);

      return [];
    }

    return data ?? [];
  }

  async createAgentPR(
    pr: Omit<DbAgentPullRequest, 'id' | 'created_at'>,
  ): Promise<DbAgentPullRequest | null> {
    const { data, error } = await this.supabase
      .from('agent_pull_requests')
      .insert(pr)
      .select()
      .single();

    if (error) {
      console.error('Error creating agent PR:', error);

      return null;
    }

    return data;
  }

  async updateAgentPR(id: string, updates: Partial<DbAgentPullRequest>): Promise<boolean> {
    const { error } = await this.supabase.from('agent_pull_requests').update(updates).eq('id', id);

    if (error) {
      console.error('Error updating agent PR:', error);

      return false;
    }

    return true;
  }

  // ===========================================
  // Agent Runner (Edge Function)
  // ===========================================

  async runAgentRunner(): Promise<{ processed: number; errors: number; results: unknown[] }> {
    const { data, error } = await this.supabase.functions.invoke('agent-runner', {
      body: {},
    });

    if (error) {
      console.error('Error running agent-runner:', error);

      return { processed: 0, errors: 1, results: [] };
    }

    return data;
  }
}
