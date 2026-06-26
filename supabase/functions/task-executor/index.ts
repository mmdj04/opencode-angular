import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentInfo {
  id: string;
  agent_name: string;
  api_key: string;
  status: string;
}

interface TaskPayload {
  action: string;
  topic: string;
  description: string;
  target_repo?: string;
  target_owner?: string;
  reason: string;
}

interface GeneratedRepo {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  files: { name: string; type: string; content: string }[];
  topics: string[];
}

async function query(supabaseUrl: string, key: string, table: string, query: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

async function insert(supabaseUrl: string, key: string, table: string, data: unknown) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function callGemma(
  apiKey: string,
  prompt: string,
  systemInstruction?: string,
): Promise<string> {
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 32768,
      thinkingConfig: { thinkingLevel: 'high' },
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p: { thought?: boolean }) => !p.thought)
    .map((p: { text: string }) => p.text)
    .join('');
}

async function generateProject(
  apiKey: string,
  agentName: string,
  topic: string,
): Promise<GeneratedRepo> {
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

  const text = await callGemma(apiKey, prompt, systemInstruction);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Gemma for project generation');

  // Clean up escaped characters in the JSON string
  let jsonStr = jsonMatch[0];
  try {
    const raw = JSON.parse(jsonStr);
    return {
      name: raw.name || 'projeto-gerado',
      description: raw.description || '',
      language: raw.language || 'HTML',
      languageColor: raw.languageColor || '#e34c26',
      files: (raw.files || []).map((f: { path?: string; name?: string; content: string }) => ({
        name: f.name || f.path || 'arquivo',
        type: 'file',
        content: f.content || '',
      })),
      topics: raw.topics || [],
    };
  } catch {
    // If parsing fails, try to fix common issues
    jsonStr = jsonStr.replace(/\\>/g, '>').replace(/\\</g, '<').replace(/\\n/g, '\n');
    const raw = JSON.parse(jsonStr);
    return {
      name: raw.name || 'projeto-gerado',
      description: raw.description || '',
      language: raw.language || 'HTML',
      languageColor: raw.languageColor || '#e34c26',
      files: (raw.files || []).map((f: { path?: string; name?: string; content: string }) => ({
        name: f.name || f.path || 'arquivo',
        type: 'file',
        content: f.content || '',
      })),
      topics: raw.topics || [],
    };
  }
}

async function generateIssue(
  apiKey: string,
  agentName: string,
  repoName: string,
  repoDescription: string,
): Promise<{ title: string; body: string; labels: string[] }> {
  const prompt = `Crie uma issue técnica para o projeto "${repoName}" (${repoDescription}).

Retorne APENAS um objeto JSON válido:
{
  "title": "título da issue",
  "body": "descrição detalhada da issue em markdown",
  "labels": ["bug"|"enhancement"|"documentation"|"feature"]
}

A issue deve ser útil e realista.`;

  const text = await callGemma(apiKey, prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Gemma for issue generation');

  return JSON.parse(jsonMatch[0]);
}

async function generatePR(
  apiKey: string,
  agentName: string,
  repoName: string,
  repoDescription: string,
): Promise<{ title: string; body: string; changes: Record<string, string> }> {
  const prompt = `Crie um Pull Request para melhorar o projeto "${repoName}" (${repoDescription}).

Retorne APENAS um objeto JSON válido:
{
  "title": "título do PR",
  "body": "descrição do PR em markdown com mudanças",
  "changes": { "nome_do_arquivo": "novo_conteúdo_do_arquivo" }
}

O PR deve conter melhorias reais e úteis.`;

  const text = await callGemma(apiKey, prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Gemma for PR generation');

  return JSON.parse(jsonMatch[0]);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { task_id, agent_id, payload } = await req.json();

    if (!agent_id || !payload) {
      return new Response(JSON.stringify({ error: 'agent_id and payload are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiDefaultKey = Deno.env.get('GEMINI_DEFAULT_KEY') || '';

    const dbHeaders = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    };

    // Fetch agent
    const agents: AgentInfo[] = await query(
      supabaseUrl,
      supabaseKey,
      'user_agents',
      `id=eq.${agent_id}&select=*`,
    );
    if (!agents.length) throw new Error('Agent not found');
    const agent = agents[0];
    const apiKey = agent.api_key || geminiDefaultKey;
    if (!apiKey) throw new Error('No API key available');

    // Update task status to running
    if (task_id) {
      await fetch(`${supabaseUrl}/rest/v1/agent_tasks?id=eq.${task_id}`, {
        method: 'PATCH',
        headers: dbHeaders,
        body: JSON.stringify({ status: 'running', started_at: new Date().toISOString() }),
      });
    }

    let result: Record<string, unknown> = {};
    const action = payload.action as string;

    switch (action) {
      case 'create_project': {
        const repo = await generateProject(apiKey, agent.agent_name, payload.topic);

        // Insert repo
        const repoData = {
          owner: agent.agent_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
          name: repo.name,
          description: repo.description,
          language: repo.language,
          language_color: repo.languageColor,
          stars: Math.floor(Math.random() * 100) + 10,
          forks: Math.floor(Math.random() * 20) + 1,
          stars_today: Math.floor(Math.random() * 10) + 1,
          watch: Math.floor(Math.random() * 50) + 5,
          topics: repo.topics,
          license: 'MIT',
          default_branch: 'main',
          template: '',
          files: repo.files,
        };

        const inserted = await insert(supabaseUrl, supabaseKey, 'generated_repos', repoData);
        result = { type: 'project_created', repo: inserted };

        // Log activity
        await insert(supabaseUrl, supabaseKey, 'agent_activity_logs', {
          agent_id,
          task_id,
          action: 'create_project',
          target_type: 'repo',
          target_id: inserted[0]?.id,
          details: { repo_name: repo.name, topic: payload.topic },
        });
        break;
      }

      case 'create_issue': {
        const targetRepo = payload.target_repo || '';
        const [owner, name] = targetRepo.split('/');

        // Fetch target repo
        const repos: { id: string; description: string }[] = await query(
          supabaseUrl,
          supabaseKey,
          'generated_repos',
          `owner=eq.${owner}&name=eq.${name}&select=id,description`,
        );
        if (!repos.length) throw new Error(`Repo ${targetRepo} not found`);

        const issue = await generateIssue(apiKey, agent.agent_name, name, repos[0].description);

        // Get next issue number
        const existingIssues: { number: number }[] = await query(
          supabaseUrl,
          supabaseKey,
          'agent_issues',
          `repo_id=eq.${repos[0].id}&select=number&order=number.desc&limit=1`,
        );
        const nextNumber = existingIssues.length ? existingIssues[0].number + 1 : 1;

        const issueData = {
          repo_id: repos[0].id,
          number: nextNumber,
          title: issue.title,
          body: issue.body,
          state: 'open',
          author_agent_id: agent_id,
          labels: issue.labels || [],
          comments_count: 0,
        };

        const inserted = await insert(supabaseUrl, supabaseKey, 'agent_issues', issueData);
        result = { type: 'issue_created', issue: inserted };

        await insert(supabaseUrl, supabaseKey, 'agent_activity_logs', {
          agent_id,
          task_id,
          action: 'create_issue',
          target_type: 'issue',
          target_id: inserted[0]?.id,
          details: { repo: targetRepo, title: issue.title, number: nextNumber },
        });
        break;
      }

      case 'create_pr': {
        const targetRepo = payload.target_repo || '';
        const [owner, name] = targetRepo.split('/');

        const repos: { id: string; description: string }[] = await query(
          supabaseUrl,
          supabaseKey,
          'generated_repos',
          `owner=eq.${owner}&name=eq.${name}&select=id,description`,
        );
        if (!repos.length) throw new Error(`Repo ${targetRepo} not found`);

        const pr = await generatePR(apiKey, agent.agent_name, name, repos[0].description);

        const existingPRs: { number: number }[] = await query(
          supabaseUrl,
          supabaseKey,
          'agent_pull_requests',
          `repo_id=eq.${repos[0].id}&select=number&order=number.desc&limit=1`,
        );
        const nextNumber = existingPRs.length ? existingPRs[0].number + 1 : 1;

        const prData = {
          repo_id: repos[0].id,
          number: nextNumber,
          title: pr.title,
          body: pr.body,
          state: 'open',
          author_agent_id: agent_id,
          head_branch: `agent-${agent.agent_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          base_branch: 'main',
          changes: pr.changes || {},
          review_status: 'pending',
        };

        const inserted = await insert(supabaseUrl, supabaseKey, 'agent_pull_requests', prData);
        result = { type: 'pr_created', pr: inserted };

        await insert(supabaseUrl, supabaseKey, 'agent_activity_logs', {
          agent_id,
          task_id,
          action: 'create_pr',
          target_type: 'pr',
          target_id: inserted[0]?.id,
          details: { repo: targetRepo, title: pr.title, number: nextNumber },
        });
        break;
      }

      case 'analyze_repo': {
        const targetRepo = payload.target_repo || '';
        const [owner, name] = targetRepo.split('/');

        const repos: { id: string; files: unknown; description: string }[] = await query(
          supabaseUrl,
          supabaseKey,
          'generated_repos',
          `owner=eq.${owner}&name=eq.${name}&select=*`,
        );
        if (!repos.length) throw new Error(`Repo ${targetRepo} not found`);

        const prompt = `Analise o projeto "${name}" e sugira 3 melhorias concretas.
Retorne APENAS um JSON válido:
{
  "suggestions": [
    { "title": "título", "description": "descrição", "priority": "high|medium|low" }
  ]
}`;

        const text = await callGemma(apiKey, prompt);
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [] };

        result = { type: 'analysis_complete', repo: targetRepo, analysis };

        await insert(supabaseUrl, supabaseKey, 'agent_activity_logs', {
          agent_id,
          task_id,
          action: 'analyze_repo',
          target_type: 'repo',
          target_id: repos[0].id,
          details: { repo: targetRepo, suggestions: analysis.suggestions?.length || 0 },
        });
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Update task status to completed
    if (task_id) {
      await fetch(`${supabaseUrl}/rest/v1/agent_tasks?id=eq.${task_id}`, {
        method: 'PATCH',
        headers: dbHeaders,
        body: JSON.stringify({
          status: 'completed',
          result,
          completed_at: new Date().toISOString(),
        }),
      });
    }

    return new Response(JSON.stringify({ status: 'success', result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Try to update task as failed
    try {
      const { task_id } = await req.json().catch(() => ({}));
      if (task_id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        await fetch(`${supabaseUrl}/rest/v1/agent_tasks?id=eq.${task_id}`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'failed',
            error_message: message,
            completed_at: new Date().toISOString(),
          }),
        });
      }
    } catch {
      // Ignore error handling errors
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
