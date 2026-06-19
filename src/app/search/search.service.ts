import { Injectable } from '@angular/core';

export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly results: SearchResult[] = [
    {
      title: 'Angular — Plataforma de desenvolvimento web',
      url: 'https://angular.dev',
      domain: 'angular.dev',
      snippet:
        'Angular é uma plataforma de desenvolvimento para construir aplicativos web de única página usando TypeScript. Desenvolvido pelo Google, oferece componentes reutilizáveis e arquitetura robusta.',
    },
    {
      title: 'Spartan UI — Primitivas de UI para Angular',
      url: 'https://spartan.ng',
      domain: 'spartan.ng',
      snippet:
        'Conjunto de componentes de UI acessíveis e estilizáveis para Angular, construídos sobre Tailwind CSS. Oferece primitivas de baixo nível com alta personalização.',
    },
    {
      title: 'Tailwind CSS — Framework CSS utility-first',
      url: 'https://tailwindcss.com',
      domain: 'tailwindcss.com',
      snippet:
        'Framework CSS utility-first para design rápido e personalizável. Permite construir interfaces diretamente no HTML com classes utilitárias de baixo nível.',
    },
    {
      title: 'TypeScript — JavaScript tipado para escalabilidade',
      url: 'https://typescriptlang.org',
      domain: 'typescriptlang.org',
      snippet:
        'Linguagem de programação tipada que compila para JavaScript. Adiciona tipos estáticos, interfaces e classes para código mais robusto e manutenível.',
    },
    {
      title: 'RxJS — Programação reativa em JavaScript',
      url: 'https://rxjs.dev',
      domain: 'rxjs.dev',
      snippet:
        'Biblioteca de programação reativa para JavaScript. Fornece Observable, operators e patterns para lidar com fluxos de dados assíncronos de forma declarativa.',
    },
    {
      title: 'NgRx — Gerenciamento de estado para Angular',
      url: 'https://ngrx.io',
      domain: 'ngrx.io',
      snippet:
        'Biblioteca de gerenciamento de estado para Angular baseada em Redux. Oferece store, effects, selectors e Entity para aplicações complexas.',
    },
    {
      title: 'Vite — Build tool moderno e rápido',
      url: 'https://vitejs.dev',
      domain: 'vitejs.dev',
      snippet:
        'Ferramenta de build que utiliza ES modules nativos para desenvolvimento instantâneo. Oferece HMR ultrarrápido e build otimizado para produção.',
    },
    {
      title: 'Vitest — Framework de testes para Vite',
      url: 'https://vitest.dev',
      domain: 'vitest.dev',
      snippet:
        'Framework de testes unitários compatível com Vite. Suporta TypeScript nativamente e oferece execução paralela com performance superior.',
    },
    {
      title: 'Playwright — Testes E2E cross-browser',
      url: 'https://playwright.dev',
      domain: 'playwright.dev',
      snippet:
        'Framework de testes end-to-end da Microsoft para Chromium, Firefox e WebKit. Oferece automação de browser com APIs modernas e debug visual.',
    },
    {
      title: 'Supabase — Backend open source',
      url: 'https://supabase.com',
      domain: 'supabase.com',
      snippet:
        'Alternativa open source ao Firebase com PostgreSQL, autenticação, storage, edge functions e real-time subscriptions.',
    },
    {
      title: 'NgIcons — Ícones para Angular',
      url: 'https://ng-icons.github.io/ng-icons',
      domain: 'ng-icons.github.io',
      snippet:
        'Biblioteca de ícones para Angular que suporta múltiplos packs como Heroicons, Lucide, Font Awesome e Material Icons com tree-shaking.',
    },
    {
      title: 'Angular Router — Roteamento de páginas',
      url: 'https://angular.dev/guide/routing',
      domain: 'angular.dev',
      snippet:
        'Sistema de roteamento oficial do Angular para navegação entre páginas. Suporta lazy loading, guards, resolvers e rotas filhas.',
    },
  ];

  search(query: string): SearchResult[] {
    if (!query?.trim()) {
      return this.results;
    }

    const q = query.toLowerCase().trim();

    return this.results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.snippet.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q),
    );
  }
}
