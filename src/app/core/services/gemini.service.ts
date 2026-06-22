import { Injectable } from '@angular/core';
import type { DbArticle } from './supabase.service';

export interface GeneratedRepo {
  owner: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  starsToday: number;
  watch: number;
  topics: string[];
  license: string;
  defaultBranch: string;
  files: { name: string; type: string; content: string }[];
}

const CATEGORY_PROMPTS: Record<string, string> = {
  research: `You are ${'{agentName}'}, a science and AI research journalist for Agentwork News.
Write about recent research papers, scientific discoveries, or academic breakthroughs in technology.
Be rigorous: mention institution names, paper titles, methodology, and key findings.
Write in Brazilian Portuguese (pt-BR).`,

  docs: `You are ${'{agentName}'}, a technical documentation specialist for Agentwork News.
Write comprehensive tutorials, detailed guides, release notes, or how-to articles.
Include step-by-step instructions, code examples, configuration details, and practical tips.
This category should be MORE extensive than others: write 8-12 paragraphs with deep technical detail.
Include practical code snippets or configuration examples in the text when relevant.
Write in Brazilian Portuguese (pt-BR).`,

  'deep-tech': `You are ${'{agentName}'}, a deep technology journalist for Agentwork News.
Cover quantum computing, biotechnology, neuroscience, space technology, nanotechnology, or advanced materials.
Explain complex scientific concepts in an accessible way while maintaining technical accuracy.
Write in Brazilian Portuguese (pt-BR).`,

  'ai-labs': `You are ${'{agentName}'}, an AI tools and applications journalist for Agentwork News.
Cover LLMs, AI agents, prompt engineering, new AI tools, AI applications, or AI industry news.
Include practical use cases, tool comparisons, and hands-on examples when possible.
Write in Brazilian Portuguese (pt-BR).`,
};

const CATEGORY_LABELS: Record<string, string> = {
  research: 'Pesquisa',
  docs: 'Documentação',
  'deep-tech': 'Deep Tech',
  'ai-labs': 'AI Labs',
};

const CATEGORY_TOPICS: Record<string, string> = {
  research: 'recent AI research papers, scientific breakthroughs, new academic discoveries in technology, novel methodologies, or experimental results',
  docs: 'new framework releases, API documentation, developer tools, programming tutorials, or technical guides',
  'deep-tech': 'quantum computing advances, biotech innovations, neuroscience discoveries, space technology, nanotechnology, or advanced materials',
  'ai-labs': 'new LLM releases, AI agent frameworks, prompt engineering techniques, AI-powered tools, or AI industry applications',
};

const CODE_REPOSITORY_SYSTEM_INSTRUCTION = `You are {agentName}, an expert web developer specializing in clean, modern single-page websites.
You generate simple, visually impressive websites with all CSS and JavaScript inline in a single HTML file.
You always include a README.md with a project description, tech stack, and how to run it.
Your code is production-quality, well-structured, responsive, and uses dark theme support.
Write all content in Brazilian Portuguese (pt-BR).`;

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private readonly API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent';

  async generateNewsArticles(agentName: string, apiKey: string): Promise<DbArticle[]> {
    const categories = Object.keys(CATEGORY_PROMPTS);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]!;
    const systemPrompt = CATEGORY_PROMPTS[randomCategory]!.replace('{agentName}', agentName);
    const categoryLabel = CATEGORY_LABELS[randomCategory]!;
    const topics = CATEGORY_TOPICS[randomCategory]!;

    const prompt = `${systemPrompt}

Generate 1 article in Brazilian Portuguese (pt-BR).
Return ONLY a valid JSON object (no markdown, no code fences, no extra text) with these fields:
- title (string): catchy headline
- snippet (string): 1-2 sentence summary
- subtitle (string): secondary headline
- source (string): always use the agent name "${agentName}"
- category (string): must be exactly "${randomCategory}"
- categoryLabel (string): must be exactly "${categoryLabel}"
- readTime (string): e.g. "5 min de leitura"
- paragraphs (array of objects with {text: string, isSubtitle?: boolean}): ${randomCategory === 'docs' ? '8-12 paragraphs' : '5-8 paragraphs'}, mark 2-3 as subtitles
- diagrams (array of objects with {type: string, code: string, caption: string}): exactly 1 Mermaid diagram that illustrates a key concept from the article. Code must be valid Mermaid syntax. Use type "mermaid". Caption must describe what the diagram shows.
- tags (array of 4-6 relevant tags in Portuguese)

Diagram requirements (MANDATORY - you MUST include exactly 1 diagram):
- For research: use flowchart (graph TD) showing research methodology or data pipeline
- For docs: use sequence diagram (sequenceDiagram) showing API flow or system interaction
- For deep-tech: use graph (graph TD or graph LR) showing technology relationships or concepts
- For ai-labs: use flowchart (graph TD) showing AI agent architecture or data flow
- Write all diagram captions and node labels in Portuguese
- Keep diagrams simple: 5-10 nodes maximum
- Mermaid syntax must be valid and renderable

Topics to pick from: ${topics}.
Date context: ${new Date().toLocaleDateString('pt-BR')}.
Make the article realistic, detailed and current. Use the agent name "${agentName}" as a watermark.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 150_000);

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
          source: (raw['source'] as string) ?? agentName,
          source_url: '',
          date: new Date().toLocaleDateString('pt-BR'),
          read_time: (raw['readTime'] as string) ?? '5 min de leitura',
          category: randomCategory,
          category_label: categoryLabel,
          author_name: agentName,
          author_avatar: '',
          image_url: '',
          paragraphs: (raw['paragraphs'] as { text: string; isSubtitle?: boolean }[]) ?? [],
          diagrams:
            (raw['diagrams'] as { type: string; code: string; caption: string }[]) ?? [],
          tags: (raw['tags'] as string[]) ?? [],
        },
      ];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateCodeRepository(agentName: string, apiKey: string): Promise<GeneratedRepo> {
    const systemInstruction = CODE_REPOSITORY_SYSTEM_INSTRUCTION.replace('{agentName}', agentName);

    const prompt = `Generate a simple, visually impressive single-page website.
Return ONLY a valid JSON object (no markdown, no code fences, no extra text) with these fields:
- name (string): repository name (kebab-case, e.g. "landing-page-moderno")
- description (string): 1-2 sentence description in Portuguese
- language (string): always "HTML"
- languageColor (string): always "#e34c26"
- stars (integer): random between 10-500
- forks (integer): random between 2-50
- starsToday (integer): random between 1-20
- watch (integer): random between 5-100
- topics (array of 3-5 relevant tags in Portuguese)
- license (string): "MIT"
- files (array of exactly 2 objects):
  1. { name: "index.html", type: "file", content: "FULL HTML with inline CSS and JS" }
     - Complete HTML5 document with meta tags, responsive design
     - All CSS inline in a <style> tag (dark theme, modern design, smooth transitions)
     - All JavaScript inline in a <script> tag (interactivity, animations)
     - Must be a complete, functional, visually impressive page
  2. { name: "README.md", type: "file", content: "Markdown README" }
     - Project title, description, tech stack, how to open the file

Date context: ${new Date().toLocaleDateString('pt-BR')}.
Make it production-quality, modern, and visually impressive.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 150_000);

    try {
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 32768,
            thinkingConfig: { thinkingLevel: 'high' },
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
        throw new Error('Empty response from Gemma');
      }

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`Invalid JSON response: ${text.slice(0, 200)}`);
      }

      const raw: Record<string, unknown> = JSON.parse(jsonMatch[0]);

      return {
        owner: agentName,
        name: (raw['name'] as string) ?? 'generated-site',
        description: (raw['description'] as string) ?? '',
        language: (raw['language'] as string) ?? 'HTML',
        languageColor: (raw['languageColor'] as string) ?? '#e34c26',
        stars: (raw['stars'] as number) ?? 0,
        forks: (raw['forks'] as number) ?? 0,
        starsToday: (raw['starsToday'] as number) ?? 0,
        watch: (raw['watch'] as number) ?? 0,
        topics: (raw['topics'] as string[]) ?? [],
        license: (raw['license'] as string) ?? 'MIT',
        defaultBranch: 'main',
        files: (raw['files'] as { name: string; type: string; content: string }[]) ?? [],
      };
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
