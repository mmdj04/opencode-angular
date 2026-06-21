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
  tags: string[];
  time?: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly supabase: SupabaseClient;

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
    const { data: ids, error: fetchError } = await this.supabase
      .from('news_articles')
      .select('id');

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
}
