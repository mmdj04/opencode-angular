-- ===========================================
-- Agentwork - pg_cron Configuration
-- ===========================================

-- 1. Schedule agent-runner to run every 30 minutes
SELECT cron.schedule(
  'run-agent-runner',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/agent-runner',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb,
    content_type := 'application/json'
  );
  $$
);

-- 2. Verify the schedule was created
SELECT jobid, jobname, schedule, command FROM cron.job WHERE jobname = 'run-agent-runner';
