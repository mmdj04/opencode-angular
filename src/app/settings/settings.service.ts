import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { GeminiService } from '../core/services/gemini.service';
import { SupabaseService } from '../core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly gemini = inject(GeminiService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly agentName = signal('');
  readonly apiKey = signal('');
  readonly isGenerating = signal(false);
  readonly isCodeGenerating = signal(false);

  constructor() {
    if (this.isBrowser) {
      this.load();
    }
  }

  async save(): Promise<void> {
    if (this.isBrowser) {
      localStorage.setItem('agentwork_agent_name', this.agentName());
      localStorage.setItem('agentwork_api_key', this.apiKey());
    }

    if (!this.agentName() || !this.apiKey()) {
      toast.error('Please fill in both Agent Name and API Key');
      return;
    }

    this.isGenerating.set(true);
    toast.info('Generating article with Gemma...');

    try {
      const articles = await this.gemini.generateNewsArticles(
        this.agentName(),
        this.apiKey(),
      );

      const success = await this.supabase.insertArticles(articles);

      if (success) {
        toast.success('Article generated!', {
          action: {
            label: 'View',
            onClick: () => {
              this.router.navigate(['/agentwork-news']);
            },
          },
        });
      } else {
        toast.error('Failed to save article to Supabase');
      }
    } catch (error) {
      console.error('Generation error:', error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Generation failed: ${message}`);
    } finally {
      this.isGenerating.set(false);
    }
  }

  async generateCode(): Promise<void> {
    if (!this.agentName() || !this.apiKey()) {
      toast.error('Please fill in both Agent Name and API Key first');
      return;
    }

    if (this.isBrowser) {
      localStorage.setItem('agentwork_agent_name', this.agentName());
      localStorage.setItem('agentwork_api_key', this.apiKey());
    }

    this.isCodeGenerating.set(true);
    toast.info('Generating website with Gemma...');

    try {
      const repo = await this.gemini.generateCodeRepository(
        this.agentName(),
        this.apiKey(),
      );

      const uniqueUsername = await this.getUniqueUsername(repo.owner);

      const success = await this.supabase.insertGeneratedRepo({
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

      if (success) {
        toast.success('Repository and developer profile generated!', {
          action: {
            label: 'View',
            onClick: () => {
              this.router.navigate(['/github/repo', uniqueUsername, repo.name]);
            },
          },
        });
      } else {
        toast.error('Failed to save repository to Supabase');
      }
    } catch (error) {
      console.error('Code generation error:', error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Generation failed: ${message}`);
    } finally {
      this.isCodeGenerating.set(false);
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

  private load(): void {
    if (!this.isBrowser) return;
    this.agentName.set(localStorage.getItem('agentwork_agent_name') ?? '');
    this.apiKey.set(localStorage.getItem('agentwork_api_key') ?? '');
  }
}
