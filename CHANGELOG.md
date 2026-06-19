# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- Angular 22.0.3 com SSR e esbuild
- PrimeNG 21.1.9 com tema Aura e traduções pt-BR
- Tailwind CSS 4.3.1 com plugin tailwindcss-primeui
- TypeScript 6.0.2 com strict mode e verbatimModuleSyntax
- Vitest 4.0.8 com code coverage (v8)
- Playwright 1.61.0 para testes E2E
- ESLint 10 com angular-eslint e flat config
- Prettier 3.8.1 com Angular HTML parser
- Husky 9 + lint-staged + commitlint (Conventional Commits)
- Knip 6.17.1 para dead code detection
- Zoneless change detection (provideZonelessChangeDetection)
- Lazy loading de rotas com loadComponent
- Web worker pattern (compute.worker.ts + worker.service.ts)
- Signal-based components (CounterComponent)
- HTTP interceptors (error + loading)
- CSS layers (theme, base, components, utilities)
- Environment configs com fileReplacements
- Path aliases (@app, @env, @shared, @core)
- Docker multi-stage build com Alpine
- .editorconfig, .gitattributes, .npmrc, .prettierignore
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- Coverage thresholds (statements: 60%, branches: 60%, lines: 60%)
- Bundle size check
- Security audit script

### Changed

- README.md com diagramas Mermaid e documentação completa
- tsconfig.json com strict mode e verbatimModuleSyntax
- eslint.config.js com padding-line rules e no-console
- prettier.config.js com Google style (bracketSpacing, trailingComma)
- angular.json com inlineCritical CSS optimization
- package.json com engines, sideEffects, scripts extras

### Fixed

- Commitlint config convertido para CommonJS
- Type-only imports para verbatimModuleSyntax
- Worker service com InjectionToken correto

## [0.0.0] - 2026-06-19

### Added

- Initial release
