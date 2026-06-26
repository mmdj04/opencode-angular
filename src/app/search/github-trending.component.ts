import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { octRepo, octRepoForked, octShield, octStar, octStarFill } from '@ng-icons/octicons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { SupabaseService, type DbGeneratedRepo } from '../core/services/supabase.service';
import { SecurityPolicyComponent } from '../github/security-policy.component';
import { type TrendingDeveloper } from './trending-data';

@Component({
  selector: 'app-github-trending',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmInputImports,
    SecurityPolicyComponent,
  ],
  providers: [
    provideIcons({ lucideSearch, octRepo, octStar, octRepoForked, octStarFill, octShield }),
  ],
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
            class="border-b-2 px-4 pt-2 pb-3 text-sm font-semibold"
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
            class="border-b-2 px-4 pt-2 pb-3 text-sm font-semibold"
            [class]="
              activeTab() === 'developers'
                ? 'border-[#f78166] text-white'
                : 'border-transparent text-[#8b949e] hover:text-white'
            "
            (click)="activeTab.set('developers')"
          >
            Developers
          </button>
          <button
            class="flex items-center gap-1.5 border-b-2 px-4 pt-2 pb-3 text-sm font-semibold"
            [class]="
              activeTab() === 'security'
                ? 'border-[#f78166] text-white'
                : 'border-transparent text-[#8b949e] hover:text-white'
            "
            (click)="activeTab.set('security')"
          >
            <ng-icon hlmIcon name="octShield" style="font-size:14px;width:14px;height:14px" />
            Security
          </button>
        </div>

        <!-- Repo List -->
        @if (activeTab() === 'repositories') {
          @if (isLoading()) {
            <!-- Repository skeleton -->
            <div class="border border-[#21262d]">
              @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
                <div class="border-b border-[#21262d] px-6 py-4 last:border-b-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="skeleton-shimmer mb-2 h-5 w-48 rounded"></div>
                      <div class="skeleton-shimmer mb-3 h-4 w-full max-w-[400px] rounded"></div>
                      <div class="flex gap-4">
                        <div class="skeleton-shimmer h-4 w-20 rounded"></div>
                        <div class="skeleton-shimmer h-4 w-16 rounded"></div>
                        <div class="skeleton-shimmer h-4 w-16 rounded"></div>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <div class="skeleton-shimmer h-8 w-16 rounded"></div>
                      <div class="skeleton-shimmer h-4 w-24 rounded"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="border border-[#21262d]">
              @for (repo of filteredRepos(); track repo.owner + repo.name) {
                <div class="border-b border-[#21262d] px-6 py-4 last:border-b-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0 flex-1">
                      <!-- Repo name -->
                      <div class="mb-1 flex items-center gap-2">
                        <ng-icon hlmIcon name="octRepo" class="text-muted-foreground h-4 w-4" />
                        <a
                          [routerLink]="['/github/repo', repo.owner, repo.name]"
                          class="text-[20px] font-semibold text-[#e0e0e0] hover:text-[#58a6ff] hover:underline"
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
                          <ng-icon hlmIcon name="octStar" class="h-4 w-4" />
                          {{ formatNumber(repo.stars) }}
                        </span>

                        <!-- Forks -->
                        <span class="flex items-center gap-1 text-[#8b949e]">
                          <ng-icon hlmIcon name="octRepoForked" class="h-4 w-4" />
                          {{ formatNumber(repo.forks) }}
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
                        <ng-icon hlmIcon name="octStarFill" class="mr-1 h-4 w-4" />
                        Star
                      </button>
                      <span class="text-muted-foreground text-[12px]">
                        {{ formatNumber(repo.starsToday) }} stars today
                      </span>
                    </div>
                  </div>
                </div>
              }

              @if (filteredRepos().length === 0) {
                <div class="px-6 py-12 text-center">
                  <ng-icon hlmIcon name="octRepo" class="text-muted-foreground mb-3 h-8 w-8" />
                  <p class="text-muted-foreground text-[14px]">Nenhum repositório gerado ainda.</p>
                  <p class="text-muted-foreground mt-1 text-[13px]">
                    Gere um repositório em Settings para vê-lo aqui.
                  </p>
                </div>
              }
            </div>
          }
        }

        <!-- Developers List -->
        @if (activeTab() === 'developers') {
          @if (isLoading()) {
            <!-- Developer skeleton -->
            <div class="border border-[#21262d]">
              @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
                <div class="border-b border-[#21262d] px-6 py-4 last:border-b-0">
                  <div class="flex items-start gap-4">
                    <div class="skeleton-shimmer h-6 w-6 rounded"></div>
                    <div class="skeleton-shimmer h-10 w-10 rounded-full"></div>
                    <div class="flex-1">
                      <div class="skeleton-shimmer mb-1 h-5 w-40 rounded"></div>
                      <div class="skeleton-shimmer mb-2 h-4 w-32 rounded"></div>
                      <div class="skeleton-shimmer mb-1 h-4 w-48 rounded"></div>
                      <div class="skeleton-shimmer h-4 w-full max-w-[300px] rounded"></div>
                    </div>
                    <div class="skeleton-shimmer h-8 w-16 rounded"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
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
                          class="text-[16px] font-semibold text-[#e0e0e0] hover:text-[#58a6ff] hover:underline"
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
                        <span class="font-medium text-[#8b949e]">POPULAR REPO</span>
                      </div>
                      <div class="flex items-center gap-1.5 text-[14px]">
                        <ng-icon hlmIcon name="octRepo" class="text-muted-foreground h-4 w-4" />
                        <a
                          href="https://github.com/{{ dev.username }}/{{ dev.popularRepo.name }}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="font-semibold text-[#58a6ff] hover:underline"
                        >
                          {{ dev.popularRepo.name }}
                        </a>
                      </div>
                      <p
                        class="text-muted-foreground mt-1 line-clamp-2 text-[13px] leading-relaxed"
                      >
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

            @if (filteredDevelopers().length === 0) {
              <div class="px-6 py-12 text-center">
                <ng-icon hlmIcon name="octRepo" class="text-muted-foreground mb-3 h-8 w-8" />
                <p class="text-muted-foreground text-[14px]">Nenhum desenvolvedor ainda.</p>
                <p class="text-muted-foreground mt-1 text-[13px]">
                  Gere um repositório em Settings para criar um perfil de desenvolvedor.
                </p>
              </div>
            }
          }
        }

        <!-- Security -->
        @if (activeTab() === 'security') {
          <!-- Title row -->
          <div class="mb-6 flex items-center justify-between">
            <h1 class="text-foreground text-[24px] font-semibold">Security</h1>
            <button
              class="rounded-md bg-[#238636] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#2ea043]"
            >
              Report a vulnerability
            </button>
          </div>

          <!-- Shared security policy content -->
          <app-security-policy />

          <!-- Security advisories -->
          <div class="border border-[#21262d]">
            <div class="border-b border-[#21262d] px-4 py-3">
              <span class="text-foreground text-[14px] font-semibold">Security advisories</span>
            </div>
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <ng-icon
                hlmIcon
                name="octShield"
                class="text-muted-foreground mb-3"
                style="font-size:32px;width:32px;height:32px"
              />
              <p class="text-muted-foreground text-[14px]">
                There aren't any published security advisories
              </p>
            </div>
          </div>
        }
      </main>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-[1280px] px-6 py-6">
          <div
            class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-[13px]"
          >
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
  private readonly supabase = inject(SupabaseService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly query = signal('');
  protected readonly activeTab = signal<'repositories' | 'developers' | 'security'>('repositories');
  protected readonly generatedRepos = signal<DbGeneratedRepo[]>([]);
  protected readonly allDevelopers = signal<TrendingDeveloper[]>([]);
  protected readonly isLoading = signal(true);

  protected readonly filteredRepos = computed(() => {
    const q = this.query().toLowerCase().trim();

    const generated = this.generatedRepos().map((r) => ({
      owner: r.owner,
      name: r.name,
      description: r.description,
      language: r.language,
      languageColor: r.language_color,
      stars: r.stars,
      forks: r.forks,
      starsToday: r.stars_today,
      watch: r.watch,
      topics: r.topics,
      license: r.license,
      defaultBranch: r.default_branch,
      fileTree: [] as { name: string; type: 'file' | 'folder'; lastCommit: string; date: string }[],
    }));

    if (!q) return generated;

    return generated.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q),
    );
  });

  protected readonly filteredDevelopers = computed(() => {
    const q = this.query().toLowerCase().trim();

    const devs = this.allDevelopers();

    if (!q) return devs;

    return devs.filter(
      (d) =>
        d.displayName.toLowerCase().includes(q) ||
        d.username.toLowerCase().includes(q) ||
        d.popularRepo.name.toLowerCase().includes(q) ||
        d.popularRepo.description.toLowerCase().includes(q),
    );
  });

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        this.loadData();
      }
    });
  }

  private async loadData(): Promise<void> {
    this.isLoading.set(true);

    const [repos, profiles] = await Promise.all([
      this.supabase.getGeneratedRepos(),
      this.supabase.getDeveloperProfiles(),
    ]);

    this.generatedRepos.set(repos);

    const supabaseDevs: TrendingDeveloper[] = profiles.map((p, i) => ({
      rank: i + 1,
      displayName: p.display_name,
      username: p.username,
      bio: p.bio,
      location: p.location,
      website: p.website,
      twitter: p.twitter,
      avatarColor: p.avatar_color,
      followers: p.followers,
      following: p.following,
      type: 'ai-agent',
      topLanguages: p.top_languages,
      pinnedRepos: p.pinned_repos,
      repos: p.repos,
      popularRepo: p.popular_repo,
    }));

    this.allDevelopers.set(supabaseDevs);
    this.isLoading.set(false);
  }

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
