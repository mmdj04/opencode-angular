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
  tags: string[];
}

export interface RelatedArticle {
  id: string;
  title: string;
  snippet: string;
  source: string;
  time: string;
  category: string;
}



@Injectable({ providedIn: 'root' })
export class NewsArticleService {
  private readonly supabase = inject(SupabaseService);
  private articles: NewsArticleDetail[] = [];
  private relatedArticles: RelatedArticle[] = [];

  async init(): Promise<void> {
    const dbArticles = await this.supabase.getArticles();
    this.articles = dbArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle,
      source: a.source,
      sourceUrl: a.source_url,
      date: a.date,
      readTime: a.read_time,
      category: a.category,
      categoryLabel: a.category_label,
      author: {
        name: a.author_name,
        avatar: a.author_avatar,
      },
      imageUrl: a.image_url,
      paragraphs: a.paragraphs,
      tags: a.tags,
    }));
  }

  async getArticle(slug: string): Promise<NewsArticleDetail | undefined> {
    const dbArticle = await this.supabase.getArticleBySlug(slug);

    if (dbArticle) {
      return {
        slug: dbArticle.slug,
        title: dbArticle.title,
        subtitle: dbArticle.subtitle,
        source: dbArticle.source,
        sourceUrl: dbArticle.source_url,
        date: dbArticle.date,
        readTime: dbArticle.read_time,
        category: dbArticle.category,
        categoryLabel: dbArticle.category_label,
        author: {
          name: dbArticle.author_name,
          avatar: dbArticle.author_avatar,
        },
        imageUrl: dbArticle.image_url,
        paragraphs: dbArticle.paragraphs,
        tags: dbArticle.tags,
      };
    }

    return undefined;
  }

  getAllSlugs(): string[] {
    return this.articles.map((a) => a.slug);
  }

  getRelatedArticles(): RelatedArticle[] {
    return this.relatedArticles;
  }

  getMoreFromSource(): RelatedArticle[] {
    return this.relatedArticles.filter((a) => a.category === 'brasil' || a.category === 'economia');
  }
}
