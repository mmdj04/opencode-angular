import { Component, inject, signal, computed, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideMapPin, lucideLink, lucideTwitter } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SupabaseService, type DbDeveloperProfile } from '../core/services/supabase.service';
import { TRENDING_DEVELOPERS, type TrendingDeveloper } from './trending-data';

@Component({
  selector: 'app-developer-detail',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideArrowLeft, lucideMapPin, lucideLink, lucideTwitter })],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background sticky top-0 z-50 border-b">
        <div class="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3">
          <a routerLink="/github" class="text-foreground shrink-0 text-xl font-bold hover:no-underline">
            Agentwork
          </a>
        </div>
      </header>

      @if (dev(); as d) {
        <main class="mx-auto max-w-[1280px] px-6 py-6">
          <!-- Back link -->
          <a routerLink="/github" class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-[14px]">
            <ng-icon hlmIcon name="lucideArrowLeft" class="h-4 w-4" />
            Back to trending
          </a>

          <!-- Profile header -->
          <div class="mb-6 flex items-start gap-5">
            <!-- Avatar -->
            <div
              class="flex h-[128px] w-[128px] shrink-0 items-center justify-center rounded-full text-[48px] font-bold text-white"
              [style.background-color]="d.avatarColor"
            >
              {{ d.displayName.charAt(0) }}
            </div>

            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-center gap-3">
                <h1 class="text-foreground text-[28px] font-bold">{{ d.displayName }}</h1>
                <button
                  hlmBtn
                  variant="outline"
                  class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
                >
                  Follow
                </button>
              </div>
              <p class="text-muted-foreground text-[16px]">{{ d.username }}</p>
              <p class="text-muted-foreground mt-1 text-[14px]">{{ d.bio }}</p>

              <!-- Meta -->
              <div class="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-[14px]">
                @if (d.location) {
                  <span class="flex items-center gap-1">
                    <ng-icon hlmIcon name="lucideMapPin" class="h-4 w-4" />
                    {{ d.location }}
                  </span>
                }
                @if (d.website) {
                  <a href="{{ d.website }}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[#58a6ff] hover:underline">
                    <ng-icon hlmIcon name="lucideLink" class="h-4 w-4" />
                    {{ formatWebsite(d.website) }}
                  </a>
                }
                @if (d.twitter) {
                  <a href="https://twitter.com/{{ d.twitter.replace('@', '') }}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[#58a6ff] hover:underline">
                    <ng-icon hlmIcon name="lucideTwitter" class="h-4 w-4" />
                    {{ d.twitter }}
                  </a>
                }
              </div>

              <!-- Stats -->
              <div class="mt-3 flex items-center gap-5 text-[14px]">
                <span class="text-muted-foreground">
                  <span class="text-foreground font-semibold">{{ formatNumber(d.followers) }}</span> followers
                </span>
                <span class="text-muted-foreground">
                  <span class="text-foreground font-semibold">{{ d.following }}</span> following
                </span>
              </div>
            </div>
          </div>

          <!-- Two column layout -->
          <div class="flex flex-col gap-6 lg:flex-row">
            <!-- Left: Pinned + Repos -->
            <div class="min-w-0 flex-1">
              <!-- Pinned -->
              <div class="mb-6">
                <h2 class="text-muted-foreground mb-3 text-[14px] font-semibold">Pinned</h2>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  @for (repo of d.pinnedRepos; track repo.name) {
                    <a
                      [routerLink]="['/repo', d.username, repo.name]"
                      class="border border-[#21262d] p-4 hover:bg-[#161b22]"
                    >
                      <div class="mb-1 flex items-center gap-2">
                        <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5z" />
                        </svg>
                        <span class="text-[14px] font-semibold text-[#58a6ff]">{{ repo.name }}</span>
                        <span class="text-muted-foreground rounded-full border border-[#30363d] px-2 py-0.5 text-[11px] font-medium">
                          Public
                        </span>
                      </div>
                      <p class="text-muted-foreground mb-3 line-clamp-2 text-[12px] leading-relaxed">{{ repo.description }}</p>
                      <div class="flex items-center gap-4 text-[12px]">
                        <span class="flex items-center gap-1">
                          <span class="inline-block h-2.5 w-2.5 rounded-full" [style.background-color]="repo.languageColor"></span>
                          <span class="text-[#8b949e]">{{ repo.language }}</span>
                        </span>
                        <span class="flex items-center gap-1 text-[#8b949e]">
                          <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 fill-current">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                          </svg>
                          {{ formatNumber(repo.stars) }}
                        </span>
                        <span class="flex items-center gap-1 text-[#8b949e]">
                          <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 fill-current">
                            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                          </svg>
                          {{ formatNumber(repo.forks) }}
                        </span>
                      </div>
                    </a>
                  }
                </div>
              </div>

              <!-- Repositories -->
              <div>
                <h2 class="text-muted-foreground mb-3 text-[14px] font-semibold">Repositories</h2>
                <div class="border border-[#21262d]">
                  @for (repo of d.repos; track repo.name) {
                    <a
                      [routerLink]="['/repo', d.username, repo.name]"
                      class="block border-b border-[#21262d] px-4 py-4 last:border-b-0 hover:bg-[#161b22]"
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0 flex-1">
                          <div class="mb-1 flex items-center gap-2">
                            <span class="text-[16px] font-semibold text-[#58a6ff]">{{ repo.name }}</span>
                            <span class="text-muted-foreground rounded-full border border-[#30363d] px-2 py-0.5 text-[11px] font-medium">
                              Public
                            </span>
                          </div>
                          <p class="text-muted-foreground mb-2 line-clamp-1 text-[13px] leading-relaxed">{{ repo.description }}</p>
                          <div class="flex items-center gap-4 text-[12px]">
                            <span class="flex items-center gap-1">
                              <span class="inline-block h-2.5 w-2.5 rounded-full" [style.background-color]="repo.languageColor"></span>
                              <span class="text-[#8b949e]">{{ repo.language }}</span>
                            </span>
                            <span class="flex items-center gap-1 text-[#8b949e]">
                              <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 fill-current">
                                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                              </svg>
                              {{ formatNumber(repo.stars) }}
                            </span>
                            <span class="flex items-center gap-1 text-[#8b949e]">
                              <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 fill-current">
                                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                              </svg>
                              {{ formatNumber(repo.forks) }}
                            </span>
                            <span class="text-muted-foreground">Updated {{ repo.updated }}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  }
                </div>
              </div>
            </div>

            <!-- Right: Sidebar -->
            <div class="w-full shrink-0 lg:w-[296px]">
              <!-- Top languages -->
              <div class="mb-4 border border-[#21262d] p-4">
                <h2 class="text-foreground mb-3 text-[14px] font-semibold">Top languages</h2>
                <div class="space-y-2.5">
                  @for (lang of d.topLanguages; track lang.name) {
                    <div>
                      <div class="mb-1 flex items-center justify-between text-[12px]">
                        <span class="flex items-center gap-1.5">
                          <span class="inline-block h-2.5 w-2.5 rounded-full" [style.background-color]="lang.color"></span>
                          <span class="text-foreground">{{ lang.name }}</span>
                        </span>
                        <span class="text-muted-foreground">{{ lang.percentage }}%</span>
                      </div>
                      <div class="h-1.5 w-full rounded-full bg-[#21262d]">
                        <div
                          class="h-full rounded-full"
                          [style.width.%]="lang.percentage"
                          [style.background-color]="lang.color"
                        ></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- GitHub link -->
              <a
                href="https://github.com/{{ d.username }}"
                target="_blank"
                rel="noopener noreferrer"
                class="border-border text-foreground flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[14px] font-semibold hover:bg-[#161b22]"
              >
                <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </main>
      } @else {
        <!-- Loading skeleton -->
        <main class="mx-auto max-w-[1280px] px-6 py-6">
          <div class="skeleton-shimmer mb-4 h-5 w-32 rounded"></div>
          <div class="flex items-start gap-5">
            <div class="skeleton-shimmer h-[128px] w-[128px] rounded-full"></div>
            <div class="flex-1">
              <div class="skeleton-shimmer mb-2 h-7 w-48 rounded"></div>
              <div class="skeleton-shimmer mb-2 h-4 w-32 rounded"></div>
              <div class="skeleton-shimmer mb-2 h-4 w-full max-w-[400px] rounded"></div>
              <div class="skeleton-shimmer h-4 w-40 rounded"></div>
            </div>
          </div>
        </main>
      }
    </div>
  `,
})
export class DeveloperDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly supabase = inject(SupabaseService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly supabaseDev = signal<TrendingDeveloper | null>(null);

  protected readonly dev = computed(() => {
    const username = this.route.snapshot.paramMap.get('username') ?? '';
    const fromSupabase = this.supabaseDev();
    if (fromSupabase && fromSupabase.username === username) {
      return fromSupabase;
    }
    return TRENDING_DEVELOPERS.find((d) => d.username === username) ?? fromSupabase;
  });

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        this.loadProfile();
      }
    });
  }

  private async loadProfile(): Promise<void> {
    const username = this.route.snapshot.paramMap.get('username') ?? '';
    if (!username) return;
    const profile = await this.supabase.getDeveloperProfileByUsername(username);
    if (profile) {
      this.supabaseDev.set(this.mapProfile(profile));
    }
  }

  private mapProfile(p: DbDeveloperProfile): TrendingDeveloper {
    return {
      rank: 1,
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
    };
  }

  formatNumber(n: number): string {
    if (n >= 1000) {
      return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    }
    return n.toString();
  }

  formatWebsite(url: string): string {
    return url.replace(/^https?:\/\//, '');
  }
}
