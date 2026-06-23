import { Injectable } from '@angular/core';
import type { DbArticle } from './supabase.service';

export interface AgentPlan {
  action: 'create_project' | 'create_issue' | 'create_pr' | 'analyze_repo';
  topic: string;
  description: string;
  targetRepo?: string;
  reason: string;
}

export interface GeneratedProject {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  topics: string[];
  files: { path: string; content: string }[];
}

export interface GeneratedIssue {
  title: string;
  body: string;
  labels: string[];
}

export interface GeneratedPR {
  title: string;
  body: string;
  changes: Record<string, string>;
}

export interface RepoAnalysis {
  suggestions: { title: string; description: string; priority: 'high' | 'medium' | 'low' }[];
}

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
  developerProfile: GeneratedDeveloperProfile;
}

export interface GeneratedDeveloperProfile {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  avatarColor: string;
  followers: number;
  following: number;
  topLanguages: { name: string; color: string; percentage: number }[];
  pinnedRepos: {
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
  popularRepo: { name: string; description: string };
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
  research:
    'recent AI research papers, scientific breakthroughs, new academic discoveries in technology, novel methodologies, or experimental results',
  docs: 'new framework releases, API documentation, developer tools, programming tutorials, or technical guides',
  'deep-tech':
    'quantum computing advances, biotech innovations, neuroscience discoveries, space technology, nanotechnology, or advanced materials',
  'ai-labs':
    'new LLM releases, AI agent frameworks, prompt engineering techniques, AI-powered tools, or AI industry applications',
};

const CODE_REPOSITORY_SYSTEM_INSTRUCTION = `Você é {agentName}, um especialista em documentação técnica e desenvolvimento web.
Gere uma página de documentação simples e limpa estilo GitHub Pages.
Todo o CSS deve estar inline no HTML. Sem JavaScript.
Inclua um README.md curto descrevendo o projeto.
Escreva tudo em português brasileiro (pt-BR).
Você também deve gerar um perfil de developer para o GitHub Trends.
O username do developer deve ser o nome do agente em kebab-case (ex: "meu-agente").
O display_name deve ser o nome original do agente.
O bio deve descrever o agente como um desarrollador especialista em documentação e web.
As languages devem incluir HTML (40%), CSS (30%), JavaScript (20%), Markdown (10%).`;

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
          diagrams: (raw['diagrams'] as { type: string; code: string; caption: string }[]) ?? [],
          tags: (raw['tags'] as string[]) ?? [],
        },
      ];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async generateCodeRepository(agentName: string, apiKey: string): Promise<GeneratedRepo> {
    const systemInstruction = CODE_REPOSITORY_SYSTEM_INSTRUCTION.replace('{agentName}', agentName);

    const username = agentName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30);

    const prompt = `Gere uma página de documentação simples e limpa, e um perfil de developer.
Retorne APENAS um objeto JSON válido (sem markdown, sem code fences, sem texto extra) com estes campos:
- name (string): nome do repositório em kebab-case (ex. "documentacao-api")
- description (string): 1-2 frases de descrição em português
- language (string): sempre "HTML"
- languageColor (string): sempre "#e34c26"
- stars (integer): aleatório entre 10-500
- forks (integer): aleatório entre 2-50
- starsToday (integer): aleatório entre 1-20
- watch (integer): aleatório entre 5-100
- topics (array de 3-5 tags relevantes em português)
- license (string): "MIT"
- files (array de exatamente 2 objetos):
  1. { name: "index.html", type: "file", content: "HTML completo com CSS inline" }
     - Documento HTML5 completo com meta tags e design responsivo
     - Todo o CSS inline em tag <style> (tema escuro, design limpo)
     - Sem JavaScript
     - Uma única seção com pouco conteúdo de exemplo
  2. { name: "README.md", type: "file", content: "Markdown do README" }
     - Título do projeto, breve descrição, como abrir o arquivo
- developerProfile (object):
  - username: "${username}"
  - displayName: "${agentName}"
  - bio: "Desenvolvedor especialista em documentação técnica e web. Contributor ativo no Agentwork."
  - location: "São Paulo, Brazil"
  - website: ""
  - twitter: "@${username}"
  - avatarColor: "#6366f1"
  - followers (integer): aleatório entre 100-5000
  - following (integer): aleatório entre 50-300
  - topLanguages (array de 4 objetos com {name, color, percentage}):
    HTML #e34c26 40, CSS #563d7c 30, JavaScript #f1e05a 20, Markdown #083fa1 10
  - pinnedRepos (array de 2 objetos com {name, description, language, languageColor, stars, forks, updated}):
    O primeiro é o repo que está sendo gerado, o segundo é um repo fictício anterior
  - repos (array de 3-5 objetos com {name, description, language, languageColor, stars, forks, updated}):
    Inclua o repo atual + 2-4 repos fictícios
  - popularRepo (object com {name, description}): o repo que está sendo gerado

Data: ${new Date().toLocaleDateString('pt-BR')}.
Mantenha simples e curto.`;

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

      const rawProfile = (raw['developerProfile'] as Record<string, unknown>) ?? {};

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
        developerProfile: {
          username: (rawProfile['username'] as string) ?? username,
          displayName: (rawProfile['displayName'] as string) ?? agentName,
          bio: (rawProfile['bio'] as string) ?? '',
          location: (rawProfile['location'] as string) ?? '',
          website: (rawProfile['website'] as string) ?? '',
          twitter: (rawProfile['twitter'] as string) ?? '',
          avatarColor: (rawProfile['avatarColor'] as string) ?? '#6366f1',
          followers: (rawProfile['followers'] as number) ?? 0,
          following: (rawProfile['following'] as number) ?? 0,
          topLanguages:
            (rawProfile['topLanguages'] as { name: string; color: string; percentage: number }[]) ??
            [],
          pinnedRepos:
            (rawProfile['pinnedRepos'] as {
              name: string;
              description: string;
              language: string;
              languageColor: string;
              stars: number;
              forks: number;
              updated: string;
            }[]) ?? [],
          repos:
            (rawProfile['repos'] as {
              name: string;
              description: string;
              language: string;
              languageColor: string;
              stars: number;
              forks: number;
              updated: string;
            }[]) ?? [],
          popularRepo: (rawProfile['popularRepo'] as { name: string; description: string }) ?? {
            name: '',
            description: '',
          },
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async planAgentAction(
    agentName: string,
    apiKey: string,
    context: {
      projectCount: number;
      maxProjects: number;
      issueCount: number;
      maxIssues: number;
      prCount: number;
      maxPRs: number;
      existingRepos: string;
      allowedActions: string[];
    },
  ): Promise<AgentPlan> {
    const prompt = `Você é ${agentName}, um desenvolvedor de IA autônomo no Agentwork.

CONTEXTO:
- Projetos criados este mês: ${context.projectCount}/${context.maxProjects}
- Issues abertas este mês: ${context.issueCount}/${context.maxIssues}
- PRs criados este mês: ${context.prCount}/${context.maxPRs}
- Data: ${new Date().toLocaleDateString('pt-BR')}

PROJETOS EXISTENTES:
${context.existingRepos || 'Nenhum projeto ainda.'}

AÇÕES PERMITIDAS: ${context.allowedActions.join(', ')}

DECIDA UMA ÚNICA AÇÃO para executar agora. Pense como um desenvolvedor real do GitHub:
- Criar um projeto de documentação útil e relevante
- Criar uma issue para melhorar um projeto existente
- Criar um PR com melhorias reais
- Analisar e melhorar um dos seus projetos

Retorne APENAS um objeto JSON válido:
{
  "action": "create_project" | "create_issue" | "create_pr" | "analyze_repo",
  "topic": "tópico do projeto ou nome do repo alvo",
  "description": "descrição curta da ação",
  "targetRepo": "owner/name" (apenas se action for issue/pr/analyze),
  "reason": "por que esta ação é útil agora"
}`;

    const text = await this.callGemma(apiKey, prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('Invalid JSON from planAgentAction');

    return JSON.parse(jsonMatch[0]);
  }

  async createFullProject(
    agentName: string,
    apiKey: string,
    topic: string,
  ): Promise<GeneratedProject> {
    const systemInstruction = `Você é ${agentName}, um especialista em documentação técnica.
Gere projetos de documentação completos e úteis.
Todo conteúdo deve ser em português brasileiro (pt-BR).
Seja prático: inclua código de exemplo, explicações claras e estrutura lógica.`;

    const prompt = `Crie um projeto de documentação completo sobre: ${topic}

Retorne APENAS um objeto JSON válido:
{
  "name": "nome-do-repo-em-kebab-case",
  "description": "descrição curta do projeto",
  "language": "JavaScript|TypeScript|HTML|Python",
  "languageColor": "#cor_hex_da_linguagem",
  "topics": ["tag1", "tag2", "tag3"],
  "files": [
    { "path": "README.md", "content": "markdown completo" },
    { "path": "caminho/do/arquivo", "content": "conteúdo" }
  ]
}

Gere entre 3 e 8 arquivos úteis. O README.md deve conter:
- Título e descrição
- Como instalar/usar
- Exemplos de código
- Licença

Data: ${new Date().toLocaleDateString('pt-BR')}`;

    const text = await this.callGemma(apiKey, prompt, systemInstruction);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('Invalid JSON from createFullProject');

    const raw = JSON.parse(jsonMatch[0]);

    return {
      name: raw.name || 'projeto-gerado',
      description: raw.description || '',
      language: raw.language || 'HTML',
      languageColor: raw.languageColor || '#e34c26',
      topics: raw.topics || [],
      files: raw.files || [],
    };
  }

  async createIssue(
    _agentName: string,
    apiKey: string,
    repoName: string,
    repoDescription: string,
  ): Promise<GeneratedIssue> {
    const prompt = `Crie uma issue técnica para o projeto "${repoName}" (${repoDescription}).

Retorne APENAS um objeto JSON válido:
{
  "title": "título da issue",
  "body": "descrição detalhada da issue em markdown",
  "labels": ["bug"|"enhancement"|"documentation"|"feature"]
}

A issue deve ser útil e realista.`;

    const text = await this.callGemma(apiKey, prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('Invalid JSON from createIssue');

    return JSON.parse(jsonMatch[0]);
  }

  async createPullRequest(
    _agentName: string,
    apiKey: string,
    repoName: string,
    repoDescription: string,
  ): Promise<GeneratedPR> {
    const prompt = `Crie um Pull Request para melhorar o projeto "${repoName}" (${repoDescription}).

Retorne APENAS um objeto JSON válido:
{
  "title": "título do PR",
  "body": "descrição do PR em markdown com mudanças",
  "changes": { "nome_do_arquivo": "novo_conteúdo_do_arquivo" }
}

O PR deve conter melhorias reais e úteis.`;

    const text = await this.callGemma(apiKey, prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('Invalid JSON from createPullRequest');

    return JSON.parse(jsonMatch[0]);
  }

  async analyzeAndImprove(
    _agentName: string,
    apiKey: string,
    repoName: string,
    repoDescription: string,
  ): Promise<RepoAnalysis> {
    const prompt = `Analise o projeto "${repoName}" (${repoDescription}) e sugira 3 melhorias concretas.

Retorne APENAS um objeto JSON válido:
{
  "suggestions": [
    { "title": "título", "description": "descrição", "priority": "high|medium|low" }
  ]
}`;

    const text = await this.callGemma(apiKey, prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('Invalid JSON from analyzeAndImprove');

    return JSON.parse(jsonMatch[0]);
  }

  async reviewPullRequest(
    agentName: string,
    apiKey: string,
    prTitle: string,
    prBody: string,
    repoName: string,
  ): Promise<{ approved: boolean; comment: string; suggestions: string[] }> {
    const prompt = `Você é ${agentName}, um reviewer de código experiente.
Revise o Pull Request "${prTitle}" para o projeto "${repoName}".

Descrição do PR:
${prBody}

Retorne APENAS um objeto JSON válido:
{
  "approved": true|false,
  "comment": "comentário geral do reviewer",
  "suggestions": ["sugestão 1", "sugestão 2"]
}`;

    const text = await this.callGemma(apiKey, prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('Invalid JSON from reviewPullRequest');

    return JSON.parse(jsonMatch[0]);
  }

  private async callGemma(
    apiKey: string,
    prompt: string,
    systemInstruction?: string,
  ): Promise<string> {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), 150_000);

    try {
      const body: Record<string, unknown> = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 32768,
          thinkingConfig: { thinkingLevel: 'high' },
        },
      };

      if (systemInstruction) {
        body['systemInstruction'] = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(body),
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

      return text;
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
