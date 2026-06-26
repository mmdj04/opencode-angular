export interface SecuritySection {
  title: string;
  content?: string;
  type?: 'paragraph' | 'list' | 'table' | 'code';
  items?: string[];
  table?: { headers: string[]; rows: string[][] };
  code?: string;
  subsections?: SecuritySection[];
}

export interface SecurityPolicy {
  contact: {
    email: string;
    github: string;
  };
  sections: SecuritySection[];
}

export const SECURITY_POLICY: SecurityPolicy = {
  contact: {
    email: 'matheusmoraesdj2025@gmail.com',
    github: 'https://github.com/mmdj04/opencode-angular',
  },
  sections: [
    {
      title: 'Security Statement',
      content:
        'Agentwork takes the security of our platform, users, and contributors seriously. As an open-source AI agents platform that uses autonomous agents to generate documentation projects, we recognize the unique security challenges that come with AI-powered systems. We appreciate the security research community and encourage responsible disclosure of vulnerabilities.\n\nIf you believe you have found a security vulnerability in Agentwork, we ask that you report it to us promptly so we can address it.',
    },
    {
      title: 'Scope & Supported Versions',
      type: 'table',
      table: {
        headers: ['Version', 'Supported'],
        rows: [
          ['Latest', '✅'],
          ['< 1.0', '❌'],
        ],
      },
      subsections: [
        {
          title: 'In scope',
          type: 'list',
          items: [
            'Frontend (Angular 22 + SSR)',
            'Backend (Supabase Edge Functions)',
            'AI Agent system (Gemma integration)',
            'Database (Supabase PostgreSQL with RLS)',
          ],
        },
        {
          title: 'Out of scope',
          type: 'list',
          items: [
            'Third-party services (Supabase hosting, Vercel, GitHub)',
            'Issues in dependencies that are not exploitable in our context',
          ],
        },
      ],
    },
    {
      title: 'Architecture Security Overview',
      content:
        "Understanding Agentwork's architecture helps security researchers identify meaningful vulnerabilities.",
      subsections: [
        {
          title: 'Frontend (Angular 22 + SSR)',
          type: 'list',
          items: [
            'TypeScript strict mode enabled across the codebase',
            'Server-Side Rendering (SSR) with Express for SEO and performance',
            'CSP headers recommended for production deployment',
            "XSS prevention via Angular's built-in template binding (no innerHTML with user input)",
            'Dark theme enforced to reduce UI-based attack surfaces',
          ],
        },
        {
          title: 'Backend (Supabase)',
          type: 'list',
          items: [
            'Row Level Security (RLS) enabled on all database tables',
            'Service role key is only used in Edge Functions (server-side), never exposed to the client',
            'Anon key has limited permissions — only reads from public tables',
            'Database functions use SECURITY INVOKER by default (not SECURITY DEFINER)',
            'API rate limiting configured at the Supabase project level',
          ],
        },
        {
          title: 'AI Agents (Gemma + Edge Functions)',
          type: 'list',
          items: [
            'Agent limits: Maximum 3 projects per month per agent (configurable)',
            'Quiet hours: Agents can be restricted to specific execution windows',
            'Auto-approve: Can be disabled for manual oversight',
            'API keys: Stored in user_agents.api_key — encrypted at rest by Supabase',
            'Task execution: Each agent action is logged in agent_activity_logs',
          ],
        },
      ],
    },
    {
      title: 'What Qualifies as a Vulnerability',
      content: 'The following are considered security vulnerabilities in Agentwork:',
      subsections: [
        {
          title: 'Authentication & Authorization',
          type: 'list',
          items: [
            'Bypassing Row Level Security (RLS) to access data from other users or agents',
            'Escalating privileges from anon to service_role or admin',
            "Accessing another agent's API key through the application",
          ],
        },
        {
          title: 'AI Agent Security',
          type: 'list',
          items: [
            'Prompt injection that causes an agent to bypass its monthly limits',
            'Prompt injection that causes an agent to execute unauthorized actions',
            'Manipulating agent configuration to gain elevated privileges',
            'Bypassing quiet hours restrictions',
          ],
        },
        {
          title: 'Injection Attacks',
          type: 'list',
          items: [
            'SQL injection through search queries or form inputs',
            'Cross-Site Scripting (XSS) that steals user tokens or session data',
            'Server-Side Request Forgery (SSRF) through Edge Functions',
            'Command injection via any user-controlled input',
          ],
        },
        {
          title: 'Data Exposure',
          type: 'list',
          items: [
            'Leaking SUPABASE_SERVICE_ROLE_KEY through logs, errors, or client-side code',
            'Exposing API keys in browser developer tools or network requests',
            'Accessing .env files or configuration through path traversal',
          ],
        },
        {
          title: 'Edge Functions',
          type: 'list',
          items: [
            'Executing arbitrary code through Edge Function parameters',
            'Bypassing CORS restrictions to call functions from unauthorized origins',
            'Denial of Service through resource exhaustion on Edge Functions',
          ],
        },
      ],
    },
    {
      title: 'What NOT to Report',
      content: 'The following are not considered security vulnerabilities:',
      type: 'list',
      items: [
        'Aesthetic or UI issues (layout bugs, color problems, responsive design)',
        'SQL query performance (slow queries that do not expose data)',
        'Expected AI behavior (Gemma generating imprecise or incorrect documentation)',
        'Rate limits that are configurable by the project admin',
        'Issues in third-party dependencies that are not exploitable in our context',
        'Social engineering attacks targeting maintainers',
      ],
    },
    {
      title: 'How to Report',
      subsections: [
        {
          title: '❌ Do NOT',
          type: 'list',
          items: [
            'Open a public GitHub issue',
            'Post on social media',
            'Share details publicly before a fix is available',
          ],
        },
        {
          title: '✅ DO',
          content:
            'Send an email to: matheusmoraesdj2025@gmail.com\n\nInclude the following information (as much as you can provide):',
          type: 'list',
          items: [
            'Type of vulnerability (e.g., SQL injection, XSS, prompt injection, privilege escalation)',
            'Affected component (e.g., Frontend, Edge Function, Supabase RLS, Agent config)',
            'Steps to reproduce — Step-by-step instructions, URLs or endpoints involved, any special configuration required',
            'Impact — What data could be accessed? What actions could be performed? Who is affected?',
            'Suggested fix (if any)',
            'Your name and affiliation (optional) — We will credit you in the fix announcement (unless you prefer to stay anonymous)',
          ],
        },
      ],
    },
    {
      title: 'Response Timeline',
      type: 'table',
      table: {
        headers: ['Stage', 'Timeline'],
        rows: [
          ['Acknowledgment', 'Within 7 days'],
          ['Triage', 'Within 14 days'],
          ['Fix deployed', 'Depends on severity'],
        ],
      },
      subsections: [
        {
          title: 'Fix Timelines by Severity',
          type: 'table',
          table: {
            headers: ['Severity', 'Example', 'Fix Timeline'],
            rows: [
              ['Critical', 'Service role key leaked, full database access', '7 days'],
              ['High', 'RLS bypass, prompt injection bypassing limits', '30 days'],
              ['Medium', 'XSS in non-sensitive context, CSRF on low-impact actions', '90 days'],
              ['Low', 'Information disclosure without direct impact', 'Best effort'],
            ],
          },
        },
      ],
    },
    {
      title: 'Responsible Disclosure Policy',
      content: 'Agentwork follows the principle of Coordinated Vulnerability Disclosure:',
      type: 'list',
      items: [
        'Report the vulnerability to us privately via email',
        'Allow us reasonable time to investigate and fix the issue (90 days maximum)',
        'Do not publicly disclose the vulnerability until we have confirmed the fix is deployed',
        'We will keep you informed of our progress and credit your contribution',
      ],
    },
    {
      title: 'Security Best Practices for Contributors',
      content: 'If you are contributing to Agentwork, please follow these security guidelines:',
      subsections: [
        {
          title: 'Never Commit Secrets',
          type: 'code',
          code: `# ❌ WRONG - committing .env\ngit add .env\n\n# ✅ CORRECT - only commit .env.example\ngit add .env.example`,
        },
        {
          title: 'Run Security Checks Before PR',
          type: 'code',
          code: `npm run security:check\nnpm run lint\nnpm run typecheck`,
        },
        {
          title: 'Protect API Keys',
          type: 'code',
          code: `// ❌ WRONG - logging sensitive data\nconsole.log('Service role key:', process.env.SUPABASE_SERVICE_ROLE_KEY);\n\n// ✅ CORRECT - never log secrets\nconsole.log('Edge Function deployed successfully');`,
        },
        {
          title: 'Use RLS Policies',
          type: 'code',
          code: `-- ❌ WRONG - SECURITY DEFINER bypasses RLS\nCREATE FUNCTION get_repos() RETURNS SETOF repos\nSECURITY DEFINER AS $$ ... $$;\n\n-- ✅ CORRECT - SECURITY INVOKER respects RLS\nCREATE FUNCTION get_repos() RETURNS SETOF repos\nSECURITY INVOKER AS $$ ... $$;`,
        },
        {
          title: 'Validate User Input',
          type: 'code',
          code: `// ❌ WRONG - trusting user input\nconst query = \`SELECT * FROM repos WHERE name = '\${userInput}'\`;\n\n// ✅ CORRECT - using parameterized queries\nconst { data } = await supabase.from('repos').select('*').eq('name', userInput);`,
        },
      ],
    },
    {
      title: 'Acknowledgments',
      content:
        "We thank all security researchers who help improve Agentwork's security. With your permission, we will credit you in:\n\n- The fix commit message\n- The release notes\n- This SECURITY.md file (if you've reported a significant vulnerability)",
      subsections: [
        {
          title: 'Hall of Fame',
          type: 'table',
          table: {
            headers: ['Researcher', 'Vulnerability', 'Date'],
            rows: [['No reports yet', '—', '—']],
          },
        },
      ],
    },
    {
      title: 'Contact',
      content:
        'For security-related questions or concerns:\n\n- Email: matheusmoraesdj2025@gmail.com\n- GitHub: https://github.com/mmdj04/opencode-angular\n\nFor general questions about the project, please use GitHub Issues.',
    },
  ],
};
