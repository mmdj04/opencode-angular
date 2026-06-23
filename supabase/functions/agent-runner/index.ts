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
  agent_id: string;
  max_projects_per_month: number;
  max_issues_per_month: number;
  max_prs_per_month: number;
  allowed_actions: string[];
  auto_approve: boolean;
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiDefaultKey = Deno.env.get('GEMINI_DEFAULT_KEY') || '';

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    };

    // 1. Fetch all active agents
    const agentsRes = await fetch(`${supabaseUrl}/rest/v1/user_agents?status=eq.active&select=*`, {
      headers,
    });
    const agents: AgentInfo[] = await agentsRes.json();

    if (!agents.length) {
      return new Response(JSON.stringify({ status: 'no_active_agents', processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results: Array<{
      agent_id: string;
      agent_name: string;
      status: string;
      plan?: PlanResult;
      task_id?: string;
      error?: string;
    }> = [];

    // 2. Process each agent
    for (const agent of agents) {
      try {
        // 2a. Fetch agent config
        const configRes = await fetch(
          `${supabaseUrl}/rest/v1/agent_config?agent_id=eq.${agent.id}&select=*`,
          { headers },
        );
        const configs: AgentConfig[] = await configRes.json();
        const config = configs[0];

        if (!config) {
          results.push({
            agent_id: agent.id,
            agent_name: agent.agent_name,
            status: 'skipped',
            error: 'No config',
          });
          continue;
        }

        // 2b. Check if auto_approve is enabled
        if (!config.auto_approve) {
          results.push({
            agent_id: agent.id,
            agent_name: agent.agent_name,
            status: 'skipped',
            error: 'Auto-approve disabled',
          });
          continue;
        }

        // 2c. Call agent-planner
        const plannerRes = await fetch(`${supabaseUrl}/functions/v1/agent-planner`, {
          method: 'POST',
          headers: {
            ...headers,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ agent_id: agent.id }),
        });

        const plannerData = await plannerRes.json();

        if (!plannerRes.ok || plannerData.status !== 'success') {
          results.push({
            agent_id: agent.id,
            agent_name: agent.agent_name,
            status: 'planner_error',
            error: plannerData.error || 'Planner failed',
          });
          continue;
        }

        const plan: PlanResult = plannerData.plan;

        // 2d. Create task in queue
        const taskRes = await fetch(`${supabaseUrl}/rest/v1/agent_tasks`, {
          method: 'POST',
          headers: {
            ...headers,
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            agent_id: agent.id,
            type: plan.action,
            status: 'pending',
            payload: plan,
            priority: 0,
          }),
        });

        const tasks = await taskRes.json();
        const task = tasks[0];

        if (!task) {
          results.push({
            agent_id: agent.id,
            agent_name: agent.agent_name,
            status: 'task_creation_error',
            error: 'Failed to create task',
          });
          continue;
        }

        // 2e. Execute task via task-executor
        const executorRes = await fetch(`${supabaseUrl}/functions/v1/task-executor`, {
          method: 'POST',
          headers: {
            ...headers,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            task_id: task.id,
            agent_id: agent.id,
            payload: plan,
          }),
        });

        const executorData = await executorRes.json();

        results.push({
          agent_id: agent.id,
          agent_name: agent.agent_name,
          status: executorRes.ok ? 'completed' : 'execution_error',
          plan,
          task_id: task.id,
          error: executorData.error,
        });
      } catch (err) {
        results.push({
          agent_id: agent.id,
          agent_name: agent.agent_name,
          status: 'error',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const processed = results.filter((r) => r.status === 'completed').length;
    const errors = results.filter((r) => r.status.includes('error')).length;

    return new Response(
      JSON.stringify({
        status: 'success',
        processed,
        errors,
        total: agents.length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
