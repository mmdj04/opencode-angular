# opencode-angular — AI Agent Rules

## Stack

- Angular 22 with SSR (Express), zoneless change detection (`provideZonelessChangeDetection()`)
- Spartan UI with helm components (Button, Card, Input, Dialog, Sonner, etc.)
- Tailwind CSS 4.3.1 with Spartan UI preset
- Vitest 4 for unit tests, Playwright 1.61 for E2E
- TypeScript 6.0.2 with strict mode and `verbatimModuleSyntax`
- ESLint 10 + angular-eslint (flat config), Prettier 3.8 with tailwind class sorting
- Husky 9 + lint-staged + commitlint (conventional commits)
- Knip 6 for dead code detection

## Conventions

### Components

- All components are **standalone** (no NgModule)
- Use **signals** (`signal()`, `computed()`, `effect()`) instead of RxJS BehaviorSubject
- Use `@if`, `@for`, `@switch` template syntax (not `*ngIf`, `*ngFor`, `*ngSwitch`)
- Use `inject()` function instead of constructor injection
- Single-file components: `<name>.component.ts` with inline template and style
- Selector prefix: `app-`

### TypeScript

- Use `import type` for type-only imports (`verbatimModuleSyntax` enforced)
- Strict mode enabled — no `any` types
- Prefer `Readonly<T>` for immutable data
- Use `signal()` for mutable state, `computed()` for derived state

### Angular Patterns

- Functional interceptors with `provideHttpClient(withInterceptors([...]))`
- Lazy-loaded routes via `loadComponent` (not `loadChildren`)
- `provideRouter()` with `withComponentInputBinding()` for route params as inputs

### Spartan UI

- Components are in `src/app/ui/` directory (58 helm components installed via CLI)
- Import helm components using `*Imports` const (e.g., `HlmButtonImports`, `HlmCardImports`)
- Use `toast()` from `@spartan-ng/brain/sonner` for notifications
- Components use `hlm` prefix for styled components (e.g., `hlmBtn`, `hlmInput`)
- Use `hlmInputGroup` + `hlmInputGroupAddon` + `hlmInputGroupInput` for icons inside inputs
- Use `hlmTabs` + `hlmTabsList` + `hlmTabsTrigger` for tab navigation
- Use `hlmButtonGroup` to group buttons with continuous border-radius
- Available categories: layout, forms, navigation, feedback, display

### Dark Mode

- Dark theme is forced (`color-scheme: dark` on `:root`, `<html class="dark">` in index.html)
- Custom palette: `#121212` (background), `#171717` (card), `#1f1f1f` (sub-card)
- Soft white text: `#e0e0e0` (foreground), `#9e9e9e` (muted)
- ThemeService available at `src/app/core/services/theme.service.ts` (for future toggle)

### Testing

- Unit tests: Vitest (`vi.spyOn`, `describe`, `it`, `expect`) — NOT Jasmine
- E2E tests: Playwright with accessibility snapshots
- Test files: `<name>.spec.ts` next to source, `<name>.e2e.ts` in `e2e/`
- Functional interceptors tested with `provideHttpClient(withInterceptors([...]))` not `HTTP_INTERCEPTORS`
- Use `TestBed.resetTestingModule()` in `beforeEach` for Angular 22 + Vitest
- Coverage thresholds: 60% statements, 60% branches, 60% functions, 60% lines

### Styling

- Tailwind CSS 4 with Spartan UI preset (`@spartan-ng/brain/hlm-tailwind-preset.css`)
- Inter v4.1 variable font installed locally in `public/fonts/inter/`
- `font-display: swap` for font loading
- `--font-family-sans: 'Inter'` (no fallbacks per design choice)
- Custom styles in `src/styles.css` using `@layer` directives
- Use semantic colors (`bg-primary`, `text-foreground`) not raw values (`bg-blue-500`)

## File Structure

```
src/
  app/
    core/
      services/          — Singleton services (LoadingService, ThemeService)
      interceptors/      — HTTP interceptors (error, loading)
    search/              — Agentwork search (homepage + results + service)
    not-found/           — 404 page
    ui/                  — 58 Spartan UI helm components (installed via CLI)
    app.config.ts        — Application providers
    app.routes.ts        — Route definitions
    app.ts               — Root component
  styles.css             — Global styles + dark theme
  index.html             — Entry HTML with font preload
e2e/                     — Playwright E2E tests
public/                  — Static assets
```

## Commands

| Command                  | Purpose                    |
| ------------------------ | -------------------------- |
| `npm run typecheck`      | TypeScript type check      |
| `npm run test`           | Unit tests via `ng test`   |
| `npm run test:coverage`  | Tests with coverage report |
| `npm run lint`           | ESLint check               |
| `npm run lint:fix`       | ESLint auto-fix            |
| `npm run format:check`   | Prettier check             |
| `npm run format`         | Prettier format            |
| `npx knip`               | Dead code detection        |
| `npm run e2e`            | Playwright E2E tests       |
| `npm run build`          | Production build           |
| `npm run start`          | Dev server on port 4200    |
| `npm run ui:add`         | Add Spartan UI component   |
| `npm run ui:theme`       | Configure theme            |
| `npm run ui:healthcheck` | Check installation health  |
| `npm run ui:info`        | Show project info          |

## Security

- Never log or expose secrets, API keys, or environment variables
- Use `.env` files for secrets — never commit them
- `.env.example` documents required variables without real values
- Validate all user input on the server side

## MCP Tools Available

- **angular-cli**: Angular best practices, code examples, documentation search, zoneless migration, devserver control, code modernization
- **spartan-ui**: Spartan UI component documentation, APIs, examples, accessibility info
- **context7**: Up-to-date library docs — add "use context7" to prompts for current Angular/Spartan UI/RxJS/Tailwind docs
