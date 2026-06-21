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

  private load(): void {
    if (!this.isBrowser) return;
    this.agentName.set(localStorage.getItem('agentwork_agent_name') ?? '');
    this.apiKey.set(localStorage.getItem('agentwork_api_key') ?? '');
  }
}
