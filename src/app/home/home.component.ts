import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideStar } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

interface Repository {
  name: string;
  description: string;
  stars: string;
  language: string;
  url: string;
}

const REPOSITORIES: Repository[] = [
  {
    name: 'microsoft/vscode',
    description: 'Visual Studio Code',
    stars: '183.9k',
    language: 'TypeScript',
    url: 'https://github.com/microsoft/vscode',
  },
  {
    name: 'angular/angular',
    description: 'Deliver web apps with confidence',
    stars: '100.1k',
    language: 'TypeScript',
    url: 'https://github.com/angular/angular',
  },
  {
    name: 'facebook/react',
    description: 'The library for web and native user interfaces',
    stars: '244.5k',
    language: 'JavaScript',
    url: 'https://github.com/facebook/react',
  },
  {
    name: 'vuejs/vue',
    description: 'Progressive JavaScript Framework',
    stars: '209.8k',
    language: 'TypeScript',
    url: 'https://github.com/vuejs/vue',
  },
  {
    name: 'sveltejs/svelte',
    description: 'web development for the rest of us',
    stars: '86.3k',
    language: 'JavaScript',
    url: 'https://github.com/sveltejs/svelte',
  },
  {
    name: 'vercel/next.js',
    description: 'The React Framework',
    stars: '138.9k',
    language: 'JavaScript',
    url: 'https://github.com/vercel/next.js',
  },
  {
    name: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development',
    stars: '94.6k',
    language: 'CSS',
    url: 'https://github.com/tailwindlabs/tailwindcss',
  },
  {
    name: 'microsoft/playwright',
    description: 'Web Testing and Automation',
    stars: '86.5k',
    language: 'TypeScript',
    url: 'https://github.com/microsoft/playwright',
  },
  {
    name: 'supabase/supabase',
    description: 'The Postgres development platform',
    stars: '100.9k',
    language: 'TypeScript',
    url: 'https://github.com/supabase/supabase',
  },
  {
    name: 'tensorflow/tensorflow',
    description: 'An Open Source Machine Learning Framework for Everyone',
    stars: '194.7k',
    language: 'Python',
    url: 'https://github.com/tensorflow/tensorflow',
  },
  {
    name: 'huggingface/transformers',
    description: 'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX',
    stars: '159.4k',
    language: 'Python',
    url: 'https://github.com/huggingface/transformers',
  },
  {
    name: 'shadcn-ui/ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    stars: '112.4k',
    language: 'TypeScript',
    url: 'https://github.com/shadcn-ui/ui',
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
};

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmInputGroupImports,
    HlmInputImports,
    HlmSeparatorImports,
  ],
  providers: [provideIcons({ lucideSearch, lucideStar })],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a routerLink="/" class="flex items-center gap-1">
            <span class="text-foreground text-[28px] font-bold tracking-tight">Agentwork</span>
          </a>
          <div class="flex items-center gap-4">
            <a hlmBtn variant="ghost" routerLink="/agentwork-news">News</a>
            <a hlmBtn variant="ghost" routerLink="/settings">Settings</a>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-6 py-12">
        <!-- Hero -->
        <div class="mb-12 text-center">
          <h1 class="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            AI documentation you can talk to
          </h1>
          <p class="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Explore repositories, understand codebases, and get insights with AI-powered documentation.
          </p>

          <!-- Search -->
          <div hlmInputGroup class="mx-auto w-full max-w-[584px]">
            <hlm-input-group-addon align="inline-start">
              <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground" />
            </hlm-input-group-addon>
            <input
              hlmInputGroupInput
              type="search"
              placeholder="Search repositories..."
              [(ngModel)]="query"
            />
          </div>
        </div>

        <!-- Repositories Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (repo of filteredRepos(); track repo.name) {
            <a [href]="repo.url" target="_blank" rel="noopener noreferrer" class="block">
              <hlm-card
                class="h-full cursor-pointer transition-all hover:border-[#3a3a3a] hover:shadow-md"
              >
                <div class="flex h-full flex-col p-5">
                  <h3 class="text-foreground mb-1 text-base font-semibold">
                    {{ repo.name }}
                  </h3>
                  <p class="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                    {{ repo.description }}
                  </p>
                  <div class="flex items-center gap-3 text-xs">
                    <span class="flex items-center gap-1">
                      <span
                        class="inline-block h-3 w-3 rounded-full"
                        [style.backgroundColor]="getColor(repo.language)"
                      ></span>
                      <span class="text-muted-foreground">{{ repo.language }}</span>
                    </span>
                    <span class="flex items-center gap-1 text-muted-foreground">
                      <ng-icon hlmIcon name="lucideStar" class="h-3.5 w-3.5" />
                      {{ repo.stars }}
                    </span>
                  </div>
                </div>
              </hlm-card>
            </a>
          }
        </div>

        @if (filteredRepos().length === 0) {
          <div class="py-16 text-center">
            <p class="text-muted-foreground text-lg">No repositories found.</p>
          </div>
        }
      </main>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-6xl px-6 py-6">
          <div
            class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-xs"
          >
            <span>&copy; 2026 Agentwork</span>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">About</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {
  protected readonly query = signal('');

  protected readonly filteredRepos = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return REPOSITORIES;
    return REPOSITORIES.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    );
  });

  getColor(language: string): string {
    return LANGUAGE_COLORS[language] ?? '#6b7280';
  }
}
