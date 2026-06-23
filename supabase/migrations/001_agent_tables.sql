-- ===========================================
-- Agentwork - Autonomous Agent Tables
-- Migration: 001_agent_tables
-- ===========================================

-- -------------------------------------------
-- Table: agent_tasks (Fila de tarefas dos agentes)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES user_agents(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'create_project',
    'update_project',
    'analyze_repo',
    'create_issue',
    'create_pr',
    'review_code',
    'contribute',
    'plan_action'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'running',
    'completed',
    'failed',
    'cancelled'
  )),
  payload JSONB NOT NULL DEFAULT '{}',
  result JSONB,
  priority INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Index for task queue queries
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created_at ON agent_tasks(created_at);

-- -------------------------------------------
-- Table: agent_activity_logs (Histórico detalhado)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS agent_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES user_agents(id) ON DELETE CASCADE,
  task_id UUID REFERENCES agent_tasks(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT CHECK (target_type IN ('repo', 'issue', 'pr', 'profile', 'task')),
  target_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for activity log queries
CREATE INDEX IF NOT EXISTS idx_agent_activity_logs_agent_id ON agent_activity_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_activity_logs_created_at ON agent_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_activity_logs_action ON agent_activity_logs(action);

-- -------------------------------------------
-- Table: agent_config (Configuração por agente)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS agent_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES user_agents(id) ON DELETE CASCADE UNIQUE,
  max_projects_per_month INTEGER NOT NULL DEFAULT 3,
  max_issues_per_month INTEGER NOT NULL DEFAULT 10,
  max_prs_per_month INTEGER NOT NULL DEFAULT 5,
  allowed_actions TEXT[] NOT NULL DEFAULT ARRAY['create_project', 'create_issue', 'create_pr']::TEXT[],
  quiet_hours_start TIME NOT NULL DEFAULT '22:00',
  quiet_hours_end TIME NOT NULL DEFAULT '06:00',
  auto_approve BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -------------------------------------------
-- Table: agent_issues (Issues reais)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS agent_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES generated_repos(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  state TEXT NOT NULL DEFAULT 'open' CHECK (state IN ('open', 'closed')),
  author_agent_id UUID NOT NULL REFERENCES user_agents(id) ON DELETE CASCADE,
  labels TEXT[] DEFAULT '{}',
  assignee_agent_id UUID REFERENCES user_agents(id) ON DELETE SET NULL,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ,
  UNIQUE(repo_id, number)
);

-- Index for issue queries
CREATE INDEX IF NOT EXISTS idx_agent_issues_repo_id ON agent_issues(repo_id);
CREATE INDEX IF NOT EXISTS idx_agent_issues_state ON agent_issues(state);
CREATE INDEX IF NOT EXISTS idx_agent_issues_author_agent_id ON agent_issues(author_agent_id);

-- -------------------------------------------
-- Table: agent_pull_requests (PRs reais)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS agent_pull_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES generated_repos(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  state TEXT NOT NULL DEFAULT 'open' CHECK (state IN ('open', 'closed', 'merged')),
  author_agent_id UUID NOT NULL REFERENCES user_agents(id) ON DELETE CASCADE,
  head_branch TEXT NOT NULL,
  base_branch TEXT NOT NULL DEFAULT 'main',
  changes JSONB DEFAULT '{}',
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN (
    'pending',
    'approved',
    'changes_requested'
  )),
  created_at TIMESTAMPTZ DEFAULT now(),
  merged_at TIMESTAMPTZ,
  UNIQUE(repo_id, number)
);

-- Index for PR queries
CREATE INDEX IF NOT EXISTS idx_agent_pull_requests_repo_id ON agent_pull_requests(repo_id);
CREATE INDEX IF NOT EXISTS idx_agent_pull_requests_state ON agent_pull_requests(state);
CREATE INDEX IF NOT EXISTS idx_agent_pull_requests_author_agent_id ON agent_pull_requests(author_agent_id);

-- -------------------------------------------
-- Function: check_agent_limits
-- Verifica se um agente pode executar uma ação
-- -------------------------------------------
CREATE OR REPLACE FUNCTION check_agent_limits(
  p_agent_id UUID,
  p_action TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_config RECORD;
  v_count INTEGER;
  v_current_time TIME;
BEGIN
  -- Buscar config do agente
  SELECT * INTO v_config FROM agent_config WHERE agent_id = p_agent_id;

  -- Sem config = sem autonomia
  IF v_config IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Verificar se ação é permitida
  IF p_action != ALL(v_config.allowed_actions) THEN
    RETURN FALSE;
  END IF;

  -- Verificar quiet hours
  v_current_time := NOW()::TIME;
  IF v_config.quiet_hours_start > v_config.quiet_hours_end THEN
    -- Quiet hours cruza meia-noite (ex: 22:00 - 06:00)
    IF v_current_time >= v_config.quiet_hours_start OR v_current_time <= v_config.quiet_hours_end THEN
      RETURN FALSE;
    END IF;
  ELSE
    -- Quiet hours no mesmo dia
    IF v_current_time BETWEEN v_config.quiet_hours_start AND v_config.quiet_hours_end THEN
      RETURN FALSE;
    END IF;
  END IF;

  -- Verificar contadores mensais
  IF p_action = 'create_project' THEN
    SELECT COUNT(*) INTO v_count FROM agent_tasks
    WHERE agent_id = p_agent_id
    AND type = 'create_project'
    AND status = 'completed'
    AND created_at >= date_trunc('month', NOW());

    IF v_count >= v_config.max_projects_per_month THEN
      RETURN FALSE;
    END IF;
  ELSIF p_action = 'create_issue' THEN
    SELECT COUNT(*) INTO v_count FROM agent_tasks
    WHERE agent_id = p_agent_id
    AND type = 'create_issue'
    AND status = 'completed'
    AND created_at >= date_trunc('month', NOW());

    IF v_count >= v_config.max_issues_per_month THEN
      RETURN FALSE;
    END IF;
  ELSIF p_action = 'create_pr' THEN
    SELECT COUNT(*) INTO v_count FROM agent_tasks
    WHERE agent_id = p_agent_id
    AND type = 'create_pr'
    AND status = 'completed'
    AND created_at >= date_trunc('month', NOW());

    IF v_count >= v_config.max_prs_per_month THEN
      RETURN FALSE;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------
-- Function: get_agent_monthly_count
-- Retorna o contador mensal de uma ação
-- -------------------------------------------
CREATE OR REPLACE FUNCTION get_agent_monthly_count(
  p_agent_id UUID,
  p_action TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM agent_tasks
  WHERE agent_id = p_agent_id
  AND type = p_action
  AND status = 'completed'
  AND created_at >= date_trunc('month', NOW());

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------
-- RLS Policies
-- -------------------------------------------

-- Habilitar RLS nas tabelas
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_pull_requests ENABLE ROW LEVEL SECURITY;

-- agent_tasks: usuários veem apenas seus próprios tasks
CREATE POLICY "Users can view own agent tasks"
  ON agent_tasks FOR SELECT
  USING (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own agent tasks"
  ON agent_tasks FOR INSERT
  WITH CHECK (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own agent tasks"
  ON agent_tasks FOR UPDATE
  USING (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

-- agent_activity_logs: usuários veem apenas seus próprios logs
CREATE POLICY "Users can view own agent activity logs"
  ON agent_activity_logs FOR SELECT
  USING (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own agent activity logs"
  ON agent_activity_logs FOR INSERT
  WITH CHECK (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

-- agent_config: usuários veem/editam apenas sua própria config
CREATE POLICY "Users can view own agent config"
  ON agent_config FOR SELECT
  USING (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own agent config"
  ON agent_config FOR INSERT
  WITH CHECK (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own agent config"
  ON agent_config FOR UPDATE
  USING (agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

-- agent_issues: issues são públicas (qualquer um vê)
CREATE POLICY "Anyone can view agent issues"
  ON agent_issues FOR SELECT
  USING (true);

CREATE POLICY "Agents can create issues"
  ON agent_issues FOR INSERT
  WITH CHECK (author_agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

-- agent_pull_requests: PRs são públicos (qualquer um vê)
CREATE POLICY "Anyone can view agent pull requests"
  ON agent_pull_requests FOR SELECT
  USING (true);

CREATE POLICY "Agents can create pull requests"
  ON agent_pull_requests FOR INSERT
  WITH CHECK (author_agent_id IN (
    SELECT id FROM user_agents WHERE user_id = auth.uid()
  ));

-- -------------------------------------------
-- Trigger: auto-update updated_at em agent_config
-- -------------------------------------------
CREATE OR REPLACE FUNCTION update_agent_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_config_timestamp
  BEFORE UPDATE ON agent_config
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_config_timestamp();
