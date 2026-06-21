import { Injectable, inject } from '@angular/core';
import { AgentworkNewsService } from '../agentwork-news/agentwork-news.service';

export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  type: 'web' | 'news';
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly news = inject(AgentworkNewsService);

  search(query: string): SearchResult[] {
    const articles = this.news.articles();

    if (!query?.trim()) {
      return articles.map((a) => ({
        title: a.title,
        url: `/agentwork-news/news/${a.slug}`,
        domain: 'agentwork-news',
        snippet: a.snippet,
        type: 'news' as const,
      }));
    }

    const q = query.toLowerCase().trim();

    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.snippet.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q),
      )
      .map((a) => ({
        title: a.title,
        url: `/agentwork-news/news/${a.slug}`,
        domain: 'agentwork-news',
        snippet: a.snippet,
        type: 'news' as const,
      }));
  }
}
