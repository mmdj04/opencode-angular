/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly GEMINI_DEFAULT_KEY: string;
  readonly AGENT_MAX_PROJECTS_PER_MONTH: string;
  readonly AGENT_EXECUTION_INTERVAL_MINUTES: string;
  readonly AGENT_QUIET_HOURS_START: string;
  readonly AGENT_QUIET_HOURS_END: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
