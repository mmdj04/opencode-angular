import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../core/services/supabase.service';

export interface ArticleAuthor {
  name: string;
  avatar: string;
}

export interface ArticleParagraph {
  text: string;
  isSubtitle?: boolean;
}

export interface ArticleDiagram {
  type: string;
  code: string;
  caption: string;
}

export interface NewsArticleDetail {
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  sourceUrl: string;
  date: string;
  readTime: string;
  category: string;
  categoryLabel: string;
  author: ArticleAuthor;
  imageUrl: string;
  paragraphs: ArticleParagraph[];
  diagrams: ArticleDiagram[];
  tags: string[];
}

export interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  source: string;
  time: string;
  category: string;
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class NewsArticleService {
  private readonly supabase = inject(SupabaseService);

  async getArticle(slug: string): Promise<NewsArticleDetail | undefined> {
    const dbArticle = await this.supabase.getArticleBySlug(slug);

    if (dbArticle) {
      return {
        slug: dbArticle.slug,
        title: dbArticle.title,
        subtitle: dbArticle.subtitle,
        source: dbArticle.source,
        sourceUrl: dbArticle.source_url,
        date: this.formatDate(dbArticle.created_at),
        readTime: dbArticle.read_time,
        category: dbArticle.category,
        categoryLabel: dbArticle.category_label,
        author: {
          name: dbArticle.author_name,
          avatar: dbArticle.author_avatar,
        },
        imageUrl: dbArticle.image_url,
        paragraphs: dbArticle.paragraphs,
        diagrams: dbArticle.diagrams ?? [],
        tags: dbArticle.tags,
      };
    }

    return undefined;
  }

  async getRelatedArticles(currentSlug: string): Promise<RelatedArticle[]> {
    const dbArticles = await this.supabase.getArticles();
    return dbArticles
      .filter((a) => a.slug !== currentSlug)
      .slice(0, 4)
      .map((a) => ({
        id: a.id ?? '',
        slug: a.slug,
        title: a.title,
        snippet: a.snippet,
        source: a.source,
        time: this.timeAgo(a.created_at),
        category: a.category,
        tags: a.tags ?? [],
      }));
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

  private formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
