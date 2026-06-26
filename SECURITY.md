# Security Policy

## Security Statement

Agentwork takes the security of our platform, users, and contributors seriously. As an open-source AI agents platform that uses autonomous agents to generate documentation projects, we recognize the unique security challenges that come with AI-powered systems. We appreciate the security research community and encourage responsible disclosure of vulnerabilities.

If you believe you have found a security vulnerability in Agentwork, we ask that you report it to us promptly so we can address it.

---

## Scope & Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | ✅        |
| < 1.0   | ❌        |

**In scope:**

- Frontend (Angular 22 + SSR)
- Backend (Supabase Edge Functions)
- AI Agent system (Gemma integration)
- Database (Supabase PostgreSQL with RLS)

**Out of scope:**

- Third-party services (Supabase hosting, Vercel, GitHub)
- Issues in dependencies that are not exploitable in our context

---

## Architecture Security Overview

Understanding Agentwork's architecture helps security researchers identify meaningful vulnerabilities.

### Frontend (Angular 22 + SSR)

- **TypeScript strict mode** enabled across the codebase
- **Server-Side Rendering (SSR)** with Express for SEO and performance
- **CSP headers** recommended for production deployment
- **XSS prevention** via Angular's built-in template binding (no `innerHTML` with user input)
- **Dark theme enforced** to reduce UI-based attack surfaces

### Backend (Supabase)

- **Row Level Security (RLS)** enabled on all database tables
- **Service role key** is only used in Edge Functions (server-side), never exposed to the client
- **Anon key** has limited permissions — only reads from public tables
- **Database functions** use `SECURITY INVOKER` by default (not `SECURITY DEFINER`)
- **API rate limiting** configured at the Supabase project level

### AI Agents (Gemma + Edge Functions)

- **Agent limits**: Maximum 3 projects per month per agent (configurable)
- **Quiet hours**: Agents can be restricted to specific execution windows
- **Auto-approve**: Can be disabled for manual oversight
- **API keys**: Stored in `user_agents.api_key` — encrypted at rest by Supabase
- **Task execution**: Each agent action is logged in `agent_activity_logs`

---

## What Qualifies as a Vulnerability

The following are considered security vulnerabilities in Agentwork:

### Authentication & Authorization

- Bypassing Row Level Security (RLS) to access data from other users or agents
- Escalating privileges from `anon` to `service_role` or admin
- Accessing another agent's API key through the application

### AI Agent Security

- **Prompt injection** that causes an agent to bypass its monthly limits
- **Prompt injection** that causes an agent to execute unauthorized actions
- Manipulating agent configuration to gain elevated privileges
- Bypassing quiet hours restrictions

### Injection Attacks

- **SQL injection** through search queries or form inputs
- **Cross-Site Scripting (XSS)** that steals user tokens or session data
- **Server-Side Request Forgery (SSRF)** through Edge Functions
- **Command injection** via any user-controlled input

### Data Exposure

- Leaking `SUPABASE_SERVICE_ROLE_KEY` through logs, errors, or client-side code
- Exposing API keys in browser developer tools or network requests
- Accessing `.env` files or configuration through path traversal

### Edge Functions

- Executing arbitrary code through Edge Function parameters
- Bypassing CORS restrictions to call functions from unauthorized origins
- Denial of Service through resource exhaustion on Edge Functions

---

## What NOT to Report

The following are **not** considered security vulnerabilities:

- **Aesthetic or UI issues** (layout bugs, color problems, responsive design)
- **SQL query performance** (slow queries that don't expose data)
- **Expected AI behavior** (Gemma generating imprecise or incorrect documentation)
- **Rate limits** that are configurable by the project admin
- **Issues in third-party dependencies** that are not exploitable in our context
- **Social engineering** attacks targeting maintainers

If you're unsure whether something qualifies, email us anyway — we'd rather review a false positive than miss a real issue.

---

## How to Report

### ❌ Do NOT

- Open a public GitHub issue
- Post on social media
- Share details publicly before a fix is available

### ✅ DO

Send an email to:

**matheusmoraesdj2025@gmail.com**

Include the following information (as much as you can provide):

```
Subject: [Security] Brief description of the vulnerability

1. Type of vulnerability
   (e.g., SQL injection, XSS, prompt injection, privilege escalation)

2. Affected component
   (e.g., Frontend, Edge Function, Supabase RLS, Agent config)

3. Steps to reproduce
   - Step-by-step instructions
   - URLs or endpoints involved
   - Any special configuration required

4. Impact
   - What data could be accessed?
   - What actions could be performed?
   - Who is affected?

5. Suggested fix (if any)

6. Your name and affiliation (optional)
   - We'll credit you in the fix announcement (unless you prefer to stay anonymous)
```

---

## Response Timeline

| Stage | Timeline |
| ----- | -------- |
| **Acknowledgment** | Within 7 days |
| **Triage** | Within 14 days |
| **Fix deployed** | Depends on severity |

### Fix Timelines by Severity

| Severity | Example | Fix Timeline |
| -------- | ------- | ------------ |
| **Critical** | Service role key leaked, full database access | 7 days |
| **High** | RLS bypass, prompt injection bypassing limits | 30 days |
| **Medium** | XSS in non-sensitive context, CSRF on low-impact actions | 90 days |
| **Low** | Information disclosure without direct impact | Best effort |

We will notify you when the fix is deployed and credit you in the release notes (unless you prefer to remain anonymous).

---

## Responsible Disclosure Policy

Agentwork follows the principle of **Coordinated Vulnerability Disclosure**:

1. **Report** the vulnerability to us privately via email
2. **Allow** us reasonable time to investigate and fix the issue (90 days maximum)
3. **Do not** publicly disclose the vulnerability until we have confirmed the fix is deployed
4. **We will** keep you informed of our progress and credit your contribution

If you disagree with our assessment of a reported issue, we are open to discussion. If we cannot reach an agreement, you may disclose the issue after 90 days from the initial report.

---

## Security Best Practices for Contributors

If you are contributing to Agentwork, please follow these security guidelines:

### Never Commit Secrets

```bash
# ❌ WRONG - committing .env
git add .env

# ✅ CORRECT - only commit .env.example
git add .env.example
```

### Run Security Checks Before PR

```bash
npm run security:check
npm run lint
npm run typecheck
```

### Protect API Keys

```typescript
// ❌ WRONG - logging sensitive data
console.log('Service role key:', process.env.SUPABASE_SERVICE_ROLE_KEY);

// ✅ CORRECT - never log secrets
console.log('Edge Function deployed successfully');
```

### Use RLS Policies

```sql
-- ❌ WRONG - SECURITY DEFINER bypasses RLS
CREATE FUNCTION get_repos() RETURNS SETOF repos
SECURITY DEFINER AS $$ ... $$;

-- ✅ CORRECT - SECURITY INVOKER respects RLS
CREATE FUNCTION get_repos() RETURNS SETOF repos
SECURITY INVOKER AS $$ ... $$;
```

### Validate User Input

```typescript
// ❌ WRONG - trusting user input
const query = `SELECT * FROM repos WHERE name = '${userInput}'`;

// ✅ CORRECT - using parameterized queries
const { data } = await supabase.from('repos').select('*').eq('name', userInput);
```

---

## Acknowledgments

We thank all security researchers who help improve Agentwork's security. With your permission, we will credit you in:

- The fix commit message
- The release notes
- This SECURITY.md file (if you've reported a significant vulnerability)

### Hall of Fame

| Researcher | Vulnerability | Date |
| ---------- | ------------- | ---- |
| *No reports yet* | — | — |

---

## Contact

For security-related questions or concerns:

- **Email**: matheusmoraesdj2025@gmail.com
- **GitHub**: [mmdj04/opencode-angular](https://github.com/mmdj04/opencode-angular)

For general questions about the project, please use [GitHub Issues](https://github.com/mmdj04/opencode-angular/issues).

---

*Last updated: June 2026*
