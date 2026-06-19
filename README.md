# Agentwork

> Angular 22 + Spartan UI + Tailwind CSS 4 — Motor de busca com SSR, signals-first e dark theme.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-green.svg)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-22.0.3-red.svg)](https://angular.dev/)

## Tech Stack

| Tecnologia   | Versão | Propósito           |
| ------------ | ------ | ------------------- |
| Angular      | 22.0.3 | Framework SPA + SSR |
| TypeScript   | 6.0.2  | Tipagem estática    |
| Spartan UI   | latest | UI Components       |
| Tailwind CSS | 4.3.1  | Utility-first CSS   |
| Vitest       | 4.0.8  | Testes unitários    |
| Playwright   | 1.61.0 | E2E tests           |
| ESLint       | 10.3.0 | Linting             |
| Prettier     | 3.8.1  | Formatação          |
| Husky        | 9.1.7  | Git hooks           |
| Knip         | 6.17.1 | Dead code detection |

## Estrutura do Projeto

```
src/
  app/
    core/
      interceptors/      — HTTP interceptors (error, loading)
      services/          — Serviços globais (ThemeService, LoadingService)
    search/              — Agentwork search (homepage + resultados)
    not-found/           — Página 404
    ui/                  — 58 Spartan UI helm components
    app.config.ts        — Configuração principal
    app.routes.ts        — Rotas com lazy loading
    app.ts               — Root component
  styles.css             — Global styles + dark theme
  index.html             — Entry HTML
e2e/                     — Playwright tests
public/                  — Static assets
```

## Rotas

| Rota              | Descrição                 |
| ----------------- | ------------------------- |
| `/`               | Agentwork search homepage |
| `/search/results` | Página de resultados      |
| `**`              | Página 404                |

## Pré-requisitos

- Node.js >= 22.0.0
- npm >= 11.17.0

## Instalação

```bash
# Clone o repositório
git clone https://github.com/mmdj04/opencode-angular.git
cd opencode-angular

# Instale dependências
npm install

# Inicie o servidor dev
npm start
```

Acesse http://localhost:4200

## Scripts Disponíveis

| Script                   | Descrição                     |
| ------------------------ | ----------------------------- |
| `npm start`              | Servidor dev com hot reload   |
| `npm run build`          | Build produção com SSR        |
| `npm run test`           | Testes unitários com coverage |
| `npm run test:coverage`  | Coverage HTML                 |
| `npm run lint`           | ESLint                        |
| `npm run lint:fix`       | ESLint com auto-fix           |
| `npm run format`         | Prettier format               |
| `npm run format:check`   | Prettier check                |
| `npm run typecheck`      | Verificação TypeScript        |
| `npm run knip`           | Dead code detection           |
| `npm run e2e`            | Playwright E2E tests          |
| `npm run security:check` | Auditoria de segurança        |
| `npm run ui:add`         | Adicionar componente Spartan  |

## Dark Theme

O projeto usa um dark theme forçado com paleta customizada:

| Camada      | Cor       | Uso                   |
| ----------- | --------- | --------------------- |
| Background  | `#121212` | Fundo da página       |
| Card        | `#171717` | Cards e containers    |
| Sub-card    | `#1f1f1f` | Elementos secundários |
| Texto       | `#e0e0e0` | Texto principal       |
| Texto muted | `#9e9e9e` | Texto secundário      |
| Border      | `#2a2a2a` | Bordas e separadores  |

## Spartan UI Components (58)

O projeto instala 58 componentes helm via CLI:

**Layout**: accordion, alert-dialog, aspect-ratio, card, collapsible, drawer, hover-card, resizable, scroll-area, separator, sheet, sidebar

**Formulários**: autocomplete, button, button-group, calendar, checkbox, combobox, date-picker, field, input, input-group, input-otp, label, native-select, radio-group, select, slider, switch, textarea, toggle, toggle-group

**Navegação**: breadcrumb, command, context-menu, menubar, navigation-menu, pagination, tabs

**Feedback**: alert, badge, dialog, empty, popover, progress, skeleton, sonner, spinner, table, tooltip

**Display**: avatar, icon, item, kbd, typography

## Convenções de Commit

| Tipo       | Descrição           | Exemplo                          |
| ---------- | ------------------- | -------------------------------- |
| `feat`     | Nova funcionalidade | `feat(search): add autocomplete` |
| `fix`      | Correção de bug     | `fix(icon): prevent clipping`    |
| `docs`     | Documentação        | `docs: update README`            |
| `style`    | Formatação          | `style: format code`             |
| `refactor` | Refatoração         | `refactor(tabs): use hlmTabs`    |
| `test`     | Testes              | `test: add unit tests`           |
| `chore`    | Manutenção          | `chore: update deps`             |

## Docker

```bash
docker build -t agentwork .
docker run -p 4000:4000 agentwork
```

## Contribuição

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## Licença

Este projeto está licenciado sob a MIT License — veja o arquivo [LICENSE](LICENSE) para detalhes.
