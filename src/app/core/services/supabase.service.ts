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
  diagrams: { type: string; code: string; caption: string }[];
  tags: string[];
  time?: string;
  created_at?: string;
}

export interface DbGeneratedRepo {
  id?: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  language_color: string;
  stars: number;
  forks: number;
  stars_today: number;
  watch: number;
  topics: string[];
  license: string;
  default_branch: string;
  template: string;
  files: { name: string; type: string; content: string }[];
  created_at?: string;
}

export interface DbDeveloperProfile {
  id?: string;
  username: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  avatar_color: string;
  followers: number;
  following: number;
  top_languages: { name: string; color: string; percentage: number }[];
  pinned_repos: {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updated: string;
  }[];
  repos: {
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updated: string;
  }[];
  popular_repo: { name: string; description: string };
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

  async insertGeneratedRepo(repo: DbGeneratedRepo): Promise<boolean> {
    const { error } = await this.supabase.from('generated_repos').insert(repo);

    if (error) {
      console.error('Error inserting generated repo:', error);
      return false;
    }

    return true;
  }

  async getGeneratedRepos(): Promise<DbGeneratedRepo[]> {
    const { data, error } = await this.supabase
      .from('generated_repos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching generated repos:', error);
      return [];
    }

    return data ?? [];
  }

  async getGeneratedRepoByOwnerAndName(
    owner: string,
    name: string,
  ): Promise<DbGeneratedRepo | null> {
    const { data, error } = await this.supabase
      .from('generated_repos')
      .select('*')
      .eq('owner', owner)
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching generated repo:', error);
      return null;
    }

    return data;
  }

  async insertDeveloperProfile(profile: DbDeveloperProfile): Promise<boolean> {
    const { error } = await this.supabase.from('developer_profiles').insert(profile);

    if (error) {
      console.error('Error inserting developer profile:', error);
      return false;
    }

    return true;
  }

  async getDeveloperProfiles(): Promise<DbDeveloperProfile[]> {
    const { data, error } = await this.supabase
      .from('developer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching developer profiles:', error);
      return [];
    }

    return data ?? [];
  }

  async getDeveloperProfileByUsername(username: string): Promise<DbDeveloperProfile | null> {
    const { data, error } = await this.supabase
      .from('developer_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching developer profile:', error);
      return null;
    }

    return data;
  }
}
