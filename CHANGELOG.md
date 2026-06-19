# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- Angular 22.0.3 com SSR e esbuild
- Spartan UI com helm components completos (Button, Card, Input, Field, Label, Badge, Dialog, Separator, Spinner, Skeleton, Alert, Tabs, Tooltip, Dropdown Menu, Sonner)
- Tailwind CSS 4.3.1 com preset Spartan UI
- TypeScript 6.0.2 com strict mode e verbatimModuleSyntax
- Vitest 4.0.8 com code coverage (v8)
- Playwright 1.61.0 para testes E2E
- ESLint 10 com angular-eslint e flat config
- Prettier 3.8.1 com Angular HTML parser e tailwind class sorting
- Husky 9 + lint-staged + commitlint (Conventional Commits)
- Knip 6.17.1 para dead code detection
- Zoneless change detection (provideZonelessChangeDetection)
- Lazy loading de rotas com loadComponent
- HTTP interceptors (error + loading)
- CSS layers (theme, base, components, utilities)
- Environment configs com fileReplacements
- Docker multi-stage build com Alpine
- .editorconfig, .gitattributes, .npmrc, .prettierignore
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- Coverage thresholds (statements: 60%, branches: 60%, lines: 60%)
- Bundle size check
- Security audit script
- components.json para CLI do Spartan UI
- Skill do Spartan UI para AI assistants
- MCP server do Spartan UI para documentação
- ThemeService para dark mode com persistência
- Scripts úteis: ui:add, ui:theme, ui:healthcheck, ui:info
- Configuração VSCode para autocomplete de classes Tailwind

### Changed

- Migrado de PrimeNG para Spartan UI
- Removido dependências: primeng, primeicons, @primeuix/themes, @primeng/mcp, tailwindcss-primeui
- Atualizado error interceptor para usar toast() do Spartan UI Sonner
- Atualizado HomeComponent para usar Card e Button do Spartan UI
- Removido traduções PrimeNG (i18n/pt-br.ts)
- Atualizado documentação (AGENTS.md, README.md)

### Removed

- Removido PrimeNG e todas as dependências relacionadas
- Removido arquivo i18n/pt-br.ts
- Removido skill primeng-integration

## [0.0.0] - 2026-06-19

### Added

- Initial release
