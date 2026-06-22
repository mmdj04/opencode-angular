import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideStar } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { TRENDING_REPOS, TRENDING_DEVELOPERS } from './trending-data';

@Component({
  selector: 'app-github-trending',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmInputImports,
  ],
  providers: [provideIcons({ lucideSearch, lucideStar })],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background sticky top-0 z-50 border-b">
        <div class="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3">
          <a routerLink="/" class="text-foreground shrink-0 text-xl font-bold hover:no-underline">
            Agentwork
          </a>
          <div hlmInputGroup class="flex-1">
            <hlm-input-group-addon align="inline-start">
              <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground" />
            </hlm-input-group-addon>
            <input
              hlmInputGroupInput
              type="search"
              placeholder="Pesquisar repositórios..."
              [(ngModel)]="query"
              (keyup.enter)="search()"
            />
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-[1280px] px-6 py-6">
        <!-- Tabs -->
        <div class="mb-4 flex items-center gap-4 border-b border-[#21262d] pb-px">
          <button
            class="border-b-2 px-4 pb-3 pt-2 text-sm font-semibold"
            [class]="
              activeTab() === 'repositories'
                ? 'border-[#f78166] text-white'
                : 'border-transparent text-[#8b949e] hover:text-white'
            "
            (click)="activeTab.set('repositories')"
          >
            Repositories
          </button>
          <button
            class="border-b-2 px-4 pb-3 pt-2 text-sm font-semibold"
            [class]="
              activeTab() === 'developers'
                ? 'border-[#f78166] text-white'
                : 'border-transparent text-[#8b949e] hover:text-white'
            "
            (click)="activeTab.set('developers')"
          >
            Developers
          </button>
        </div>

        <!-- Repo List -->
        @if (activeTab() === 'repositories') {
          <div class="border border-[#21262d]">
            @for (repo of filteredRepos(); track repo.owner + repo.name) {
              <div class="border-b border-[#21262d] px-6 py-4 last:border-b-0">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <!-- Repo name -->
                    <div class="mb-1 flex items-center gap-2">
                      <svg
                        viewBox="0 0 16 16"
                        class="text-muted-foreground h-4 w-4 fill-current"
                      >
                        <path
                          d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                        />
                      </svg>
                      <a
                        [routerLink]="['/github/repo', repo.owner, repo.name]"
                        class="text-[#e0e0e0] text-[20px] font-semibold hover:text-[#58a6ff] hover:underline"
                      >
                        {{ repo.owner }} / {{ repo.name }}
                      </a>
                    </div>

                    <!-- Description -->
                    <p class="text-muted-foreground mb-3 text-[14px] leading-relaxed">
                      {{ repo.description }}
                    </p>

                    <!-- Meta row -->
                    <div class="flex flex-wrap items-center gap-4 text-[12px]">
                      <!-- Language -->
                      <span class="flex items-center gap-1.5">
                        <span
                          class="inline-block h-3 w-3 rounded-full"
                          [style.background-color]="repo.languageColor"
                        ></span>
                        <span class="text-[#8b949e]">{{ repo.language }}</span>
                      </span>

                      <!-- Stars -->
                      <span class="flex items-center gap-1 text-[#8b949e]">
                        <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current">
                          <path
                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"
                          />
                        </svg>
                        {{ formatNumber(repo.stars) }}
                      </span>

                      <!-- Forks -->
                      <span class="flex items-center gap-1 text-[#8b949e]">
                        <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current">
                          <path
                            d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          />
                        </svg>
                        {{ formatNumber(repo.forks) }}
                      </span>

                      <!-- Built by -->
                      <span class="flex items-center gap-1 text-[#8b949e]">
                        Built by
                        @for (i of [1, 2, 3]; track i) {
                          <span
                            class="inline-block h-5 w-5 rounded-full border border-[#21262d] bg-[#30363d]"
                          ></span>
                        }
                      </span>
                    </div>
                  </div>

                  <!-- Right side: Star button + stars today -->
                  <div class="flex shrink-0 flex-col items-end gap-2">
                    <button
                      hlmBtn
                      variant="outline"
                      class="border-[#30363d] bg-[#21262d] text-[12px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
                    >
                      <ng-icon hlmIcon name="lucideStar" class="mr-1 h-4 w-4" />
                      Star
                    </button>
                    <span class="text-muted-foreground text-[12px]">
                      {{ formatNumber(repo.starsToday) }} stars today
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Developers List -->
        @if (activeTab() === 'developers') {
          <div class="border border-[#21262d]">
            @for (dev of filteredDevelopers(); track dev.username) {
              <div class="border-b border-[#21262d] px-6 py-4 last:border-b-0">
                <div class="flex items-start gap-4">
                  <!-- Rank -->
                  <span class="text-muted-foreground w-6 shrink-0 text-right text-[14px]">
                    {{ dev.rank }}
                  </span>

                  <!-- Avatar -->
                  <a
                    [routerLink]="['/github/dev', dev.username]"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                    [style.background-color]="dev.avatarColor"
                  >
                    {{ dev.displayName.charAt(0) }}
                  </a>

                  <!-- Info -->
                  <div class="min-w-0 flex-1">
                    <div class="mb-0.5">
                      <a
                        [routerLink]="['/github/dev', dev.username]"
                        class="text-[#e0e0e0] text-[16px] font-semibold hover:text-[#58a6ff] hover:underline"
                      >
                        {{ dev.displayName }}
                      </a>
                    </div>
                    <div class="text-muted-foreground mb-2 text-[14px]">
                      {{ dev.username }}
                    </div>

                    <!-- Popular repo -->
                    <div class="flex items-center gap-1.5 text-[12px]">
                      <span class="text-[#e3b341]">🔥</span>
                      <span class="text-[#8b949e] font-medium">POPULAR REPO</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-[14px]">
                      <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                        <path
                          d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                        />
                      </svg>
                      <a
                        href="https://github.com/{{ dev.username }}/{{ dev.popularRepo.name }}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-[#58a6ff] font-semibold hover:underline"
                      >
                        {{ dev.popularRepo.name }}
                      </a>
                    </div>
                    <p class="text-muted-foreground mt-1 line-clamp-2 text-[13px] leading-relaxed">
                      {{ dev.popularRepo.description }}
                    </p>
                  </div>

                  <!-- Follow button -->
                  <div class="shrink-0">
                    <button
                      hlmBtn
                      variant="outline"
                      class="border-[#30363d] bg-[#21262d] text-[12px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
                    >
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </main>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-[1280px] px-6 py-6">
          <div class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-[13px]">
            <span>© 2026 Agentwork</span>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">About</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class GitHubTrendingComponent {
  private readonly router = inject(Router);

  protected readonly query = signal('');
  protected readonly activeTab = signal<'repositories' | 'developers'>('repositories');

  protected readonly filteredRepos = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return TRENDING_REPOS;
    return TRENDING_REPOS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q),
    );
  });

  protected readonly filteredDevelopers = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return TRENDING_DEVELOPERS;
    return TRENDING_DEVELOPERS.filter(
      (d) =>
        d.displayName.toLowerCase().includes(q) ||
        d.username.toLowerCase().includes(q) ||
        d.popularRepo.name.toLowerCase().includes(q) ||
        d.popularRepo.description.toLowerCase().includes(q),
    );
  });

  search(): void {
    const q = this.query();
    if (q) {
      this.router.navigate(['/search/results'], { queryParams: { q } });
    }
  }

  formatNumber(n: number): string {
    if (n >= 1000) {
      return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    }
    return n.toString();
  }
}
