import { Injectable } from '@angular/core';
import type { DbArticle } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent';

  async generateNewsArticles(agentName: string, apiKey: string): Promise<DbArticle[]> {
    const prompt = `You are ${agentName}, a technology news journalist for Agentwork News.
Generate 1 technology news article in Brazilian Portuguese (pt-BR).
Return ONLY a valid JSON object (no markdown, no code fences, no extra text) with these fields:
- title (string): catchy headline
- snippet (string): 1-2 sentence summary
- subtitle (string): secondary headline
- source (string): always use the agent name "${agentName}"
- category (string): one of "tech", "ai", "startup", "security", "science", "gadgets"
- categoryLabel (string): capitalized version of category
- readTime (string): e.g. "5 min de leitura"
- paragraphs (array of objects with {text: string, isSubtitle?: boolean}): 5-8 paragraphs, mark 2-3 as subtitles
- tags (array of 4-6 relevant tags in Portuguese)

Topic: pick one from artificial intelligence, cybersecurity, tech startups, new gadgets, space technology, or programming frameworks.
Date context: ${new Date().toLocaleDateString('pt-BR')}.
Make the article realistic, detailed and current. Use the agent name "${agentName}" as a watermark.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000);

    try {
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 32768,
            thinkingConfig: {
              thinkingLevel: 'high',
            },
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Gemini API error: ${response.status}`;
        try {
          const parsed = JSON.parse(errorBody);
          errorMessage += ` - ${parsed.error?.message ?? errorBody}`;
        } catch {
          errorMessage += ` - ${errorBody}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts ?? [];
      const text = parts
        .filter((p: { thought?: boolean }) => !p.thought)
        .map((p: { text: string }) => p.text)
        .join('');

      if (!text) {
        throw new Error('Empty response from Gemma - no answer parts found');
      }

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(
          `Invalid response format from Gemma. Response starts with: ${text.slice(0, 200)}`,
        );
      }

      const raw: Record<string, unknown> = JSON.parse(jsonMatch[0]);
      const slug = this.toSlug(raw['title'] as string);

      return [
        {
          slug,
          title: (raw['title'] as string) ?? '',
          snippet: (raw['snippet'] as string) ?? '',
          subtitle: (raw['subtitle'] as string) ?? '',
          source: (raw['source'] as string) ?? 'Agentwork Gemma',
          source_url: '',
          date: new Date().toLocaleDateString('pt-BR'),
          read_time: (raw['readTime'] as string) ?? '5 min de leitura',
          category: (raw['category'] as string) ?? 'tech',
          category_label: (raw['categoryLabel'] as string) ?? 'Tech',
          author_name: agentName,
          author_avatar: '',
          image_url: '',
          paragraphs: (raw['paragraphs'] as { text: string; isSubtitle?: boolean }[]) ?? [],
          tags: (raw['tags'] as string[]) ?? [],
        },
      ];
    } finally {
      clearTimeout(timeoutId);
    }
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
