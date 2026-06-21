import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../core/services/supabase.service';

export interface QuickLink {
  name: string;
  url: string;
  icon: string;
}

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
}



@Injectable({ providedIn: 'root' })
export class AgentworkNewsService {
  private readonly supabase = inject(SupabaseService);

  readonly quickLinks: QuickLink[] = [
    {
      name: 'Outlook',
      url: 'https://outlook.live.com',
      icon: 'M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h4v2H7V9zm6 0h4v2h-4V9zm-6 3h4v2H7v-2zm6 0h4v2h-4v-2z',
    },
    {
      name: 'Booking',
      url: 'https://www.booking.com',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
    },
    {
      name: 'Walmart',
      url: 'https://www.walmart.com',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
    },
    {
      name: 'eBay',
      url: 'https://www.ebay.com',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com',
      icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com',
      icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z',
    },
  ];

  readonly tabs: NewsTab[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'news', label: 'News' },
    { id: 'worldcup', label: 'World Cup' },
    { id: 'money', label: 'Money' },
    { id: 'sports', label: 'Sports' },
    { id: 'entertainment', label: 'Entertainment' },
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
