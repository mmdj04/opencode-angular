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

interface AgentConfig {
  max_projects_per_month: number;
  max_issues_per_month: number;
  max_prs_per_month: number;
  allowed_actions: string[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  auto_approve: boolean;
}

interface RepoInfo {
  id: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  topics: string[];
}

interface PlanResult {
  action: string;
  topic: string;
  description: string;
  target_repo?: string;
  target_owner?: string;
  reason: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { agent_id } = await req.json();

    if (!agent_id) {
      return new Response(JSON.stringify({ error: 'agent_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_DEFAULT_KEY') || '';

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    };

    // 1. Fetch agent info
    const agentRes = await fetch(`${supabaseUrl}/rest/v1/user_agents?id=eq.${agent_id}&select=*`, {
      headers,
    });
    const agents: AgentInfo[] = await agentRes.json();
    if (!agents.length) {
      return new Response(JSON.stringify({ error: 'Agent not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const agent = agents[0];

    // 2. Fetch agent config
    const configRes = await fetch(
      `${supabaseUrl}/rest/v1/agent_config?agent_id=eq.${agent_id}&select=*`,
      { headers },
    );
    const configs: AgentConfig[] = await configRes.json();
    const config = configs[0];

    if (!config) {
      return new Response(JSON.stringify({ error: 'Agent has no config. Create one first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Check quiet hours
    const now = new Date();
    const currentTime = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
    const quietStart = config.quiet_hours_start?.slice(0, 5) || '22:00';
    const quietEnd = config.quiet_hours_end?.slice(0, 5) || '06:00';

    if (quietStart > quietEnd) {
      if (currentTime >= quietStart || currentTime <= quietEnd) {
        return new Response(JSON.stringify({ status: 'skipped', reason: 'quiet_hours' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      if (currentTime >= quietStart && currentTime <= quietEnd) {
        return new Response(JSON.stringify({ status: 'skipped', reason: 'quiet_hours' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Fetch existing repos
    const reposRes = await fetch(
      `${supabaseUrl}/rest/v1/generated_repos?select=id,owner,name,description,language,topics&order=created_at.desc&limit=20`,
      { headers },
    );
    const repos: RepoInfo[] = await reposRes.json();

    // 5. Fetch agent's monthly task counts
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const tasksRes = await fetch(
      `${supabaseUrl}/rest/v1/agent_tasks?agent_id=eq.${agent_id}&status=eq.completed&created_at=gte.${monthStart}&select=type`,
      { headers },
    );
    const completedTasks: { type: string }[] = await tasksRes.json();

    const projectCount = completedTasks.filter((t) => t.type === 'create_project').length;
    const issueCount = completedTasks.filter((t) => t.type === 'create_issue').length;
    const prCount = completedTasks.filter((t) => t.type === 'create_pr').length;

    // 6. Build context and call Gemma
    const apiKey = agent.api_key || geminiKey;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'No API key available for this agent' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reposList = repos
      .map((r) => `- ${r.owner}/${r.name}: ${r.description} [${r.language}]`)
      .join('\n');

    const prompt = `Você é ${agent.agent_name}, um desenvolvedor de IA autônomo no Agentwork.

CONTEXTO:
- Projetos criados este mês: ${projectCount}/${config.max_projects_per_month}
- Issues abertas este mês: ${issueCount}/${config.max_issues_per_month}
- PRs criados este mês: ${prCount}/${config.max_prs_per_month}
- Data: ${now.toLocaleDateString('pt-BR')}

PROJETOS EXISTENTES:
${reposList || 'Nenhum projeto ainda.'}

AÇÕES PERMITIDAS: ${config.allowed_actions.join(', ')}

DECIDA UMA ÚNICA AÇÃO para executar agora. Pense como um desenvolvedor real do GitHub:
- Criar um projeto de documentação útil e relevante
- Criar uma issue para melhorar um projeto existente
- Criar um PR com melhorias reais
- Analisar e melhorar um dos seus projetos

Retorne APENAS um objeto JSON válido (sem markdown, sem code fences):
{
  "action": "create_project" | "create_issue" | "create_pr" | "analyze_repo",
  "topic": "tópico do projeto ou nome do repo alvo",
  "description": "descrição curta da ação",
  "target_repo": "owner/name" (apenas se action for issue/pr/analyze),
  "reason": "por que esta ação é útil agora"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingLevel: 'high' },
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      throw new Error(`Gemini API error: ${geminiRes.status} - ${errBody}`);
    }

    const geminiData = await geminiRes.json();
    const parts = geminiData.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .filter((p: { thought?: boolean }) => !p.thought)
      .map((p: { text: string }) => p.text)
      .join('');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Invalid JSON from Gemma: ${text.slice(0, 200)}`);
    }

    const plan: PlanResult = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ status: 'success', plan, agent_name: agent.agent_name }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
