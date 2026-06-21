import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideNewspaper,
  lucideSearch,
  lucideSettings,
} from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search-results',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmBadgeImports,
    HlmButtonGroupImports,
    HlmButtonImports,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmInputImports,
    HlmSeparatorImports,
    HlmTabsImports,
  ],
  providers: [
    provideIcons({ lucideSearch, lucideChevronLeft, lucideChevronRight, lucideSettings, lucideNewspaper }),
  ],
  template: `
    <div class="bg-background flex min-h-screen flex-col">
      <!-- Header -->
      <header class="border-border flex items-center gap-4 border-b px-6 py-3">
        <a routerLink="/" class="text-foreground shrink-0 text-xl font-semibold hover:no-underline">
          Agentwork
        </a>
        <div hlmInputGroup class="flex-1">
          <hlm-input-group-addon align="inline-start">
            <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground" />
          </hlm-input-group-addon>
          <input hlmInputGroupInput type="search" [(ngModel)]="query" (keyup.enter)="search()" />
        </div>
        <button hlmBtn variant="ghost" size="icon-sm" class="text-muted-foreground shrink-0">
          <ng-icon hlmIcon name="lucideSettings" />
        </button>
      </header>

      <!-- Tabs -->
      <nav
        hlmTabs
        [tab]="activeTab()"
        class="border-border border-b px-6"
        (tabActivated)="activeTab.set($event)"
      >
        <div hlmTabsList variant="line">
          @for (tab of tabs; track tab.id) {
            <button hlmTabsTrigger [hlmTabsTrigger]="tab.id">{{ tab.label }}</button>
          }
        </div>
      </nav>

      <!-- Results info -->
      <div class="mx-auto w-full max-w-[650px] px-6 pt-4">
        <p class="text-muted-foreground text-[13px]">
          Cerca de {{ results().length }} resultados ({{ elapsed() }} segundos)
        </p>
      </div>

      <!-- Results -->
      <main class="mx-auto w-full max-w-[650px] flex-1 px-6 py-2">
        @for (result of paginatedResults(); track result.url + result.title) {
          <article class="py-4">
            <div class="mb-0.5 flex items-center gap-2">
              <p class="text-muted-foreground text-[12px]">{{ result.domain }}</p>
              @if (result.type === 'news') {
                <span hlmBadge variant="secondary" class="text-[10px]">
                  <ng-icon hlmIcon name="lucideNewspaper" class="mr-0.5 h-3 w-3" />
                  Notícia
                </span>
              }
            </div>
            <a
              [href]="result.url"
              [routerLink]="result.type === 'news' ? result.url : null"
              [target]="result.type === 'news' ? '_self' : '_blank'"
              [attr.rel]="result.type === 'news' ? null : 'noopener noreferrer'"
              class="text-[18px] leading-snug text-blue-600 hover:underline"
            >
              {{ result.title }}
            </a>
            <p class="text-muted-foreground mt-1 text-sm text-[13px] leading-relaxed">
              {{ result.snippet }}
            </p>
          </article>
        } @empty {
          <div hlmEmpty>
            <div hlmEmptyContent>
              <p hlmEmptyTitle>Nenhum resultado encontrado</p>
              <p hlmEmptyDescription>
                Nenhum resultado encontrado para "{{ query() }}". Tente usar outros termos de busca.
              </p>
            </div>
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
          <div hlmButtonGroup>
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
          </div>
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
    { id: 'noticias', label: 'Notícias' },
  ];

  private readonly perPage = 10;

  protected readonly results = computed(() => {
    const all = this.searchService.search(this.query());
    const tab = this.activeTab();

    if (tab === 'noticias') {
      return all.filter((r) => r.type === 'news');
    }

    return all;
  });

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
