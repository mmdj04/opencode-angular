import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../core/services/supabase.service';

export interface NewsTab {
  id: string;
  label: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  source: string;
  time: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class AgentworkNewsService {
  private readonly supabase = inject(SupabaseService);

  readonly tabs: NewsTab[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'news', label: 'News' },
  ];

  readonly articles = signal<NewsArticle[]>([]);

  async init(): Promise<void> {
    const dbArticles = await this.supabase.getArticles();
    this.articles.set(
      dbArticles.map((a) => ({
        id: a.id ?? '',
        slug: a.slug,
        title: a.title,
        snippet: a.snippet,
        source: a.source,
        time: this.timeAgo(a.created_at),
        category: a.category,
        imageUrl: a.image_url,
        tags: a.tags ?? [],
      })),
    );
  }

  async refreshArticles(): Promise<void> {
    const dbArticles = await this.supabase.getArticles();
    this.articles.set(
      dbArticles.map((a) => ({
        id: a.id ?? '',
        slug: a.slug,
        title: a.title,
        snippet: a.snippet,
        source: a.source,
        time: this.timeAgo(a.created_at),
        category: a.category,
        imageUrl: a.image_url,
        tags: a.tags ?? [],
      })),
    );
  }

  getArticlesByCategory(category: string): NewsArticle[] {
    if (category === 'discover') {
      return this.articles();
    }

    return this.articles().filter((a) => a.category === category);
  }

  private timeAgo(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin}min atrás`;
    if (diffH < 24) return `${diffH}h atrás`;
    return `${diffD}d atrás`;
  }
}
