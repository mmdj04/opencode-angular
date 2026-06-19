import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideSearch,
  lucideSettings,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { hlmMuted } from '@spartan-ng/helm/typography';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search-results',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    HlmSeparatorImports,
  ],
  providers: [
    provideIcons({ lucideSearch, lucideChevronLeft, lucideChevronRight, lucideSettings }),
  ],
  template: `
    <div class="bg-background flex min-h-screen flex-col">
      <!-- Header -->
      <header class="border-border flex items-center gap-4 border-b px-6 py-3">
        <a
          routerLink="/search"
          class="text-foreground shrink-0 text-xl font-semibold hover:no-underline"
        >
          Agentwork
        </a>
        <div class="relative flex-1">
          <div
            class="border-input bg-background focus-within:ring-ring flex h-10 items-center rounded-full border px-4 shadow-sm focus-within:ring-1"
          >
            <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground mr-2 shrink-0" />
            <input
              hlmInput
              class="h-full flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
              [(ngModel)]="query"
              (keyup.enter)="search()"
            />
          </div>
        </div>
        <button hlmBtn variant="ghost" size="icon-sm" class="text-muted-foreground shrink-0">
          <ng-icon hlmIcon name="lucideSettings" />
        </button>
      </header>

      <!-- Tabs -->
      <nav class="border-border flex gap-1 border-b px-6">
        @for (tab of tabs; track tab.id) {
          <button
            hlmBtn
            [variant]="activeTab() === tab.id ? 'ghost' : 'ghost'"
            class="relative rounded-none px-4 py-2 text-[13px]"
            [class]="
              activeTab() === tab.id
                ? 'border-primary text-foreground border-b-2'
                : 'text-muted-foreground hover:text-foreground'
            "
            (click)="activeTab.set(tab.id)"
          >
            {{ tab.label }}
          </button>
        }
      </nav>

      <!-- Results info -->
      <div class="mx-auto w-full max-w-[650px] px-6 pt-4">
        <p class="text-muted-foreground text-[13px]">
          Cerca de {{ results().length }} resultados ({{ elapsed() }} segundos)
        </p>
      </div>

      <!-- Results -->
      <main class="mx-auto w-full max-w-[650px] flex-1 px-6 py-2">
        @for (result of paginatedResults(); track result.url) {
          <article class="py-4">
            <p class="text-muted-foreground mb-0.5 text-[12px]">{{ result.domain }}</p>
            <a
              [href]="result.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[18px] leading-snug text-blue-600 hover:underline"
            >
              {{ result.title }}
            </a>
            <p class="${hlmMuted} mt-1 text-[13px] leading-relaxed">{{ result.snippet }}</p>
          </article>
        } @empty {
          <div class="py-12 text-center">
            <p class="text-muted-foreground">Nenhum resultado encontrado para "{{ query() }}"</p>
            <p class="text-muted-foreground mt-2 text-sm">Tente usar outros termos de busca.</p>
          </div>
        }
      </main>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <nav class="flex items-center justify-center gap-2 py-6">
          <button hlmBtn variant="outline" size="sm" [disabled]="page() === 1" (click)="prevPage()">
            <ng-icon hlmIcon name="lucideChevronLeft" class="mr-1" />
            Anterior
          </button>
          @for (p of pages(); track p) {
            <button
              hlmBtn
              [variant]="p === page() ? 'default' : 'outline'"
              size="sm"
              class="min-w-[32px]"
              (click)="goToPage(p)"
            >
              {{ p }}
            </button>
          }
          <button
            hlmBtn
            variant="outline"
            size="sm"
            [disabled]="page() === totalPages()"
            (click)="nextPage()"
          >
            Próxima
            <ng-icon hlmIcon name="lucideChevronRight" class="ml-1" />
          </button>
        </nav>
      }

      <!-- Footer -->
      <footer
        class="border-border bg-secondary text-muted-foreground mt-auto border-t px-6 py-4 text-center text-[13px]"
      >
        Agentwork © 2026
      </footer>
    </div>
  `,
})
export class SearchResultsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  protected readonly query = signal('');
  protected readonly page = signal(1);
  protected readonly activeTab = signal('todos');
  protected readonly elapsed = signal('0,3');

  protected readonly tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'imagens', label: 'Imagens' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'noticias', label: 'Notícias' },
    { id: 'maps', label: 'Maps' },
    { id: 'mais', label: 'Mais' },
  ];

  private readonly perPage = 10;

  protected readonly results = computed(() => this.searchService.search(this.query()));

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.results().length / this.perPage)),
  );

  protected readonly paginatedResults = computed(() => {
    const start = (this.page() - 1) * this.perPage;

    return this.results().slice(start, start + this.perPage);
  });

  protected readonly pages = computed(() => {
    const total = this.totalPages();

    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.query.set(params['q'] ?? '');
      this.page.set(1);
    });
  }

  search(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.query() },
      queryParamsHandling: 'merge',
    });
  }

  goToPage(p: number): void {
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
