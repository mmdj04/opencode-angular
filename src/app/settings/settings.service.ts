import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { GeminiService } from '../core/services/gemini.service';
import { SupabaseService, type DbUserAgent } from '../core/services/supabase.service';
import { AuthService } from '../core/services/auth.service';

const MAX_AGENTS = 5;

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly gemini = inject(GeminiService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly agents = signal<DbUserAgent[]>([]);
  readonly isLoadingAgents = signal(false);
  readonly isCreatingAgent = signal(false);
  readonly editingAgent = signal<DbUserAgent | null>(null);
  readonly showEditDialog = signal(false);
  readonly showConfirmDialog = signal(false);
  readonly showDeleteDialog = signal(false);
  readonly pendingAction = signal<'article' | 'repository' | null>(null);
  readonly selectedAgent = signal<DbUserAgent | null>(null);
  readonly generatingArticleFor = signal<string | null>(null);
  readonly generatingRepoFor = signal<string | null>(null);

  readonly newAgentName = signal('');
  readonly newAgentApiKey = signal('');
  readonly editAgentName = signal('');
  readonly editAgentApiKey = signal('');

  async loadAgents(): Promise<void> {
    const userId = this.auth.user()?.id;
    if (!userId) return;

    this.isLoadingAgents.set(true);
    try {
      const agents = await this.supabase.getUserAgents(userId);
      this.agents.set(agents);
    } finally {
      this.isLoadingAgents.set(false);
    }
  }

  async createAgent(): Promise<void> {
    const userId = this.auth.user()?.id;
    if (!userId) return;

    const name = this.newAgentName().trim();
    const apiKey = this.newAgentApiKey().trim();

    if (!name || !apiKey) {
      toast.error('Please fill in both Agent Name and API Key');
      return;
    }

    const count = await this.supabase.countUserAgents(userId);
    if (count >= MAX_AGENTS) {
      toast.error(`Maximum of ${MAX_AGENTS} agents reached`);
      return;
    }

    this.isCreatingAgent.set(true);
    try {
      const success = await this.supabase.insertUserAgent({
        user_id: userId,
        agent_name: name,
        api_key: apiKey,
        status: 'active',
      });

      if (success) {
        toast.success(`Agent "${name}" created`);
        this.newAgentName.set('');
        this.newAgentApiKey.set('');
        await this.loadAgents();
      } else {
        toast.error('Failed to create agent');
      }
    } finally {
      this.isCreatingAgent.set(false);
    }
  }

  openEditDialog(agent: DbUserAgent): void {
    this.editingAgent.set(agent);
    this.editAgentName.set(agent.agent_name);
    this.editAgentApiKey.set(agent.api_key);
    this.showEditDialog.set(true);
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.editingAgent.set(null);
  }

  async saveEdit(): Promise<void> {
    const agent = this.editingAgent();
    if (!agent?.id) return;

    const name = this.editAgentName().trim();
    const apiKey = this.editAgentApiKey().trim();

    if (!name || !apiKey) {
      toast.error('Please fill in both Agent Name and API Key');
      return;
    }

    const success = await this.supabase.updateUserAgent(agent.id, {
      agent_name: name,
      api_key: apiKey,
    });

    if (success) {
      toast.success('Agent updated');
      this.closeEditDialog();
      await this.loadAgents();
    } else {
      toast.error('Failed to update agent');
    }
  }

  async toggleStatus(agent: DbUserAgent): Promise<void> {
    if (!agent.id) return;

    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    const success = await this.supabase.updateUserAgent(agent.id, { status: newStatus });

    if (success) {
      toast.success(`Agent "${agent.agent_name}" ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      await this.loadAgents();
    } else {
      toast.error('Failed to update agent status');
    }
  }

  openDeleteDialog(agent: DbUserAgent): void {
    this.selectedAgent.set(agent);
    this.showDeleteDialog.set(true);
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog.set(false);
    this.selectedAgent.set(null);
  }

  async deleteAgent(): Promise<void> {
    const agent = this.selectedAgent();
    if (!agent?.id) return;

    const success = await this.supabase.deleteUserAgent(agent.id);

    if (success) {
      toast.success(`Agent "${agent.agent_name}" deleted`);
      this.closeDeleteDialog();
      await this.loadAgents();
    } else {
      toast.error('Failed to delete agent');
    }
  }

  openConfirmDialog(agent: DbUserAgent, action: 'article' | 'repository'): void {
    if (agent.status !== 'active') {
      toast.error('Only active agents can generate content');
      return;
    }
    this.selectedAgent.set(agent);
    this.pendingAction.set(action);
    this.showConfirmDialog.set(true);
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog.set(false);
    this.selectedAgent.set(null);
    this.pendingAction.set(null);
  }

  async executeConfirmedAction(): Promise<void> {
    const agent = this.selectedAgent();
    const action = this.pendingAction();
    if (!agent || !action) return;

    this.closeConfirmDialog();

    if (action === 'article') {
      await this.generateArticleForAgent(agent);
    } else {
      await this.generateRepoForAgent(agent);
    }
  }

  private async generateArticleForAgent(agent: DbUserAgent): Promise<void> {
    this.generatingArticleFor.set(agent.id ?? null);
    toast.info(`Generating article with ${agent.agent_name}...`);

    try {
      const articles = await this.gemini.generateNewsArticles(agent.agent_name, agent.api_key);
      const success = await this.supabase.insertArticles(articles);

      if (success) {
        toast.success('Article generated!', {
          action: {
            label: 'View',
            onClick: () => this.router.navigate(['/agentwork-news']),
          },
        });
      } else {
        toast.error('Failed to save article');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Generation failed: ${message}`);
    } finally {
      this.generatingArticleFor.set(null);
    }
  }

  private async generateRepoForAgent(agent: DbUserAgent): Promise<void> {
    this.generatingRepoFor.set(agent.id ?? null);
    toast.info(`Generating repository with ${agent.agent_name}...`);

    try {
      const repo = await this.gemini.generateCodeRepository(agent.agent_name, agent.api_key);
      const uniqueUsername = await this.getUniqueUsername(repo.owner);

      const repoSuccess = await this.supabase.insertGeneratedRepo({
        owner: uniqueUsername,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        language_color: repo.languageColor,
        stars: repo.stars,
        forks: repo.forks,
        stars_today: repo.starsToday,
        watch: repo.watch,
        topics: repo.topics,
        license: repo.license,
        default_branch: repo.defaultBranch,
        template: '',
        files: repo.files,
      });

      const profile = repo.developerProfile;
      await this.supabase.insertDeveloperProfile({
        username: uniqueUsername,
        display_name: profile.displayName,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        twitter: profile.twitter,
        avatar_color: profile.avatarColor,
        followers: profile.followers,
        following: profile.following,
        top_languages: profile.topLanguages,
        pinned_repos: profile.pinnedRepos,
        repos: profile.repos,
        popular_repo: profile.popularRepo,
      });

      if (repoSuccess) {
        toast.success('Repository generated!', {
          action: {
            label: 'View',
            onClick: () => this.router.navigate(['/github/repo', uniqueUsername, repo.name]),
          },
        });
      } else {
        toast.error('Failed to save repository');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Generation failed: ${message}`);
    } finally {
      this.generatingRepoFor.set(null);
    }
  }

  private async getUniqueUsername(baseUsername: string): Promise<string> {
    const slug = baseUsername
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let candidate = slug;
    let counter = 2;

    while (await this.supabase.checkUsernameExists(candidate)) {
      candidate = `${slug}-${counter}`;
      counter++;
    }

    return candidate;
  }
}
