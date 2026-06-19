# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- Angular 22.0.3 com SSR e esbuild
- Spartan UI com 58 helm components completos
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
- Docker multi-stage build com Alpine
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- Coverage thresholds (statements: 60%, branches: 60%, lines: 60%)
- Security audit script
- Skill do Spartan UI para AI assistants
- MCP server do Spartan UI para documentação
- Agentwork search homepage com barra de busca Spartan UI
- Página de resultados de busca com tabs, paginação e mock data
- SearchService com 12 resultados mockados
- Dark theme forçado com paleta customizada (#121212, #171717, #1f1f1f)
- hlmInputGroup + hlmInputGroupAddon para ícones dentro de inputs
- hlmTabs + hlmTabsList variant="line" para navegação por abas
- hlmButtonGroup para agrupamento de botões de paginação
- Scripts úteis: ui:add, ui:theme, ui:healthcheck, ui:info

### Changed

- Migrado de PrimeNG para Spartan UI
- Removido dependências: primeng, primeicons, @primeuix/themes, @primeng/mcp, tailwindcss-primeui
- Página inicial agora é o Agentwork search (era Counter demo)
- Removido página de Settings (era Supabase Studio style)
- Atualizado documentação (AGENTS.md, README.md, CONTRIBUTING.md, CHANGELOG.md)

### Removed

- Removido PrimeNG e todas as dependências relacionadas
- Removido HomeComponent (Counter demo)
- Removido SettingsComponent e 8 sub-componentes
- Removido arquivo i18n/pt-br.ts
- Removido skill primeng-integration

## [0.0.0] - 2026-06-19

### Added

- Initial release
