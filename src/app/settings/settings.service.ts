import { Injectable, inject, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { GeminiService } from '../core/services/gemini.service';
import { SupabaseService } from '../core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly gemini = inject(GeminiService);
  private readonly supabase = inject(SupabaseService);

  readonly agentName = signal('');
  readonly apiKey = signal('');
  readonly isGenerating = signal(false);

  constructor() {
    this.load();
  }

  async save(): Promise<void> {
    localStorage.setItem('agentwork_agent_name', this.agentName());
    localStorage.setItem('agentwork_api_key', this.apiKey());

    if (!this.agentName() || !this.apiKey()) {
      toast.error('Please fill in both Agent Name and API Key');
      return;
    }

    this.isGenerating.set(true);
    toast.info('Generating articles with Gemma...');

    try {
      const articles = await this.gemini.generateNewsArticles(
        this.agentName(),
        this.apiKey(),
      );

      await this.supabase.clearGemmaArticles();
      const success = await this.supabase.insertArticles(articles);

      if (success) {
        toast.success(`${articles.length} articles generated successfully!`);
      } else {
        toast.error('Failed to save articles to Supabase');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate articles. Check your API key.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  private load(): void {
    this.agentName.set(localStorage.getItem('agentwork_agent_name') ?? '');
    this.apiKey.set(localStorage.getItem('agentwork_api_key') ?? '');
  }
}
