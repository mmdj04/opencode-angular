# opencode-angular — AI Agent Rules

## Stack

- Angular 22 with SSR (Express), zoneless change detection (`provideZonelessChangeDetection()`)
- PrimeNG 21.1.9 (Aura theme, pt-BR translations, cssLayer, inputVariant 'filled', ripple)
- Tailwind CSS 4.3.1 with `tailwindcss-primeui` plugin
- Vitest 4 for unit tests, Playwright 1.61 for E2E
- TypeScript 6.0.2 with strict mode and `verbatimModuleSyntax`
- ESLint 10 + angular-eslint (flat config), Prettier 3.8
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
- `provideAnimationsAsync()` for PrimeNG animations
- `providePrimeNG()` with `theme.options` for PrimeNG config (not top-level)

### PrimeNG

- Import PrimeNG modules individually (no barrel `PrimeNG` imports)
- Use `MessageService` for toast notifications via `@primeeng/api`
- Translations in `src/app/i18n/pt-br.ts` — correct accented characters
- cssLayer enabled — custom CSS goes in `@layer utilities` or `@layer components`

### Testing

- Unit tests: Vitest (`vi.spyOn`, `describe`, `it`, `expect`) — NOT Jasmine
- E2E tests: Playwright with accessibility snapshots
- Test files: `<name>.spec.ts` next to source, `<name>.e2e.ts` in `e2e/`
- Functional interceptors tested with `provideHttpClient(withInterceptors([...]))` not `HTTP_INTERCEPTORS`
- Use `TestBed.resetTestingModule()` in `beforeEach` for Angular 22 + Vitest
- Coverage thresholds: 60% statements, 60% branches, 60% functions, 60% lines

### Styling

- Tailwind CSS 4 with `@theme` tokens mapped to PrimeNG CSS variables
- Inter v4.1 variable font installed locally in `public/fonts/inter/`
- `font-display: swap` for font loading
- `--font-family-sans: 'Inter'` (no fallbacks per design choice)
- Custom styles in `src/styles.css` using `@layer` directives

## File Structure

```
src/
  app/
    core/
      services/          — Singleton services (LoadingService, etc.)
      interceptors/      — HTTP interceptors (error, loading)
    home/                — Home feature component
    i18n/                — Translation files (pt-br.ts)
    app.config.ts        — Application providers
    app.routes.ts        — Route definitions
    app.ts               — Root component
  styles.css             — Global styles + Tailwind layers
  index.html             — Entry HTML with font preload
e2e/                     — Playwright E2E tests
public/fonts/inter/      — Inter font files (woff2)
```

## Commands

| Command                 | Purpose                    |
| ----------------------- | -------------------------- |
| `npm run typecheck`     | TypeScript type check      |
| `npm run test`          | Unit tests via `ng test`   |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint`          | ESLint check               |
| `npm run lint:fix`      | ESLint auto-fix            |
| `npm run format:check`  | Prettier check             |
| `npm run format`        | Prettier format            |
| `npx knip`              | Dead code detection        |
| `npm run e2e`           | Playwright E2E tests       |
| `npm run build`         | Production build           |
| `npm run start`         | Dev server on port 4200    |

## Security

- Never log or expose secrets, API keys, or environment variables
- Use `.env` files for secrets — never commit them
- `.env.example` documents required variables without real values
- Validate all user input on the server side
- Use `--legacy-peer-deps` for npm installs (PrimeNG 21 peer dep mismatch with Angular 22)

## MCP Tools Available

- **angular-cli**: Angular best practices, code examples, documentation search, zoneless migration, devserver control, code modernization
- **primeng**: PrimeNG component documentation, props, events, theming, code examples
- **context7**: Up-to-date library docs — add "use context7" to prompts for current Angular/PrimeNG/RxJS/Tailwind docs
