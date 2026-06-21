import { Injectable } from '@angular/core';
import type { DbArticle } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent';

  async generateNewsArticles(agentName: string, apiKey: string): Promise<DbArticle[]> {
    const prompt = `You are ${agentName}, a technology news journalist for Agentwork News.
Generate 6 technology news articles in Brazilian Portuguese (pt-BR).
Return ONLY a valid JSON array (no markdown, no code fences, no extra text) with exactly 6 objects.
Each object must have these fields:
- title (string): catchy headline
- snippet (string): 1-2 sentence summary
- subtitle (string): secondary headline
- source (string): tech outlet name like "TechCrunch", "The Verge", "Wired", "Ars Technica", "MIT Tech Review", "Engadget"
- category (string): one of "tech", "ai", "startup", "security", "science", "gadgets"
- categoryLabel (string): capitalized version of category
- readTime (string): e.g. "3 min de leitura"
- paragraphs (array of objects with {text: string, isSubtitle?: boolean}): 3-5 paragraphs, mark 1-2 as subtitles
- tags (array of 3-5 relevant tags in Portuguese)
- time (string): e.g. "2h ago", "5h ago"

Topics to cover: artificial intelligence, cybersecurity, tech startups, new gadgets, space technology, programming frameworks.
Date context: ${new Date().toLocaleDateString('pt-BR')}.
Make the articles realistic and current. Use the agent name "${agentName}" as a watermark in each article.`;

    const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const rawArticles: unknown[] = JSON.parse(jsonMatch[0]);

    return rawArticles.map((raw: unknown, index: number) => {
      const article = raw as Record<string, unknown>;
      const slug = this.toSlug(article['title'] as string);

      return {
        slug,
        title: (article['title'] as string) ?? '',
        snippet: (article['snippet'] as string) ?? '',
        subtitle: (article['subtitle'] as string) ?? '',
        source: (article['source'] as string) ?? 'Agentwork Gemma',
        source_url: '',
        date: new Date().toLocaleDateString('pt-BR'),
        read_time: (article['readTime'] as string) ?? '3 min de leitura',
        category: (article['category'] as string) ?? 'tech',
        category_label: (article['categoryLabel'] as string) ?? 'Tech',
        author_name: agentName,
        author_avatar: '',
        image_url: '',
        paragraphs: (article['paragraphs'] as { text: string; isSubtitle?: boolean }[]) ?? [],
        tags: (article['tags'] as string[]) ?? [],
        time: `${2 + index}h ago`,
      };
    });
  }

  private toSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
  }
}
