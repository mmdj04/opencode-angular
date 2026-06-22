import { Component, inject, signal, computed, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTwitter } from '@ng-icons/lucide';
import {
  octArrowLeft,
  octLocation,
  octLink,
  octRepo,
  octStar,
  octRepoForked,
  octMarkGithub,
} from '@ng-icons/octicons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SupabaseService, type DbDeveloperProfile } from '../core/services/supabase.service';
import { TRENDING_DEVELOPERS, type TrendingDeveloper } from './trending-data';

@Component({
  selector: 'app-developer-detail',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [
    provideIcons({
      octArrowLeft,
      octLocation,
      octLink,
      octRepo,
      octStar,
      octRepoForked,
      octMarkGithub,
      lucideTwitter,
    }),
  ],
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
            <ng-icon name="octArrowLeft" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
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
                    <ng-icon name="octLocation" style="font-size:16px;width:16px;height:16px" />
                    {{ d.location }}
                  </span>
                }
                @if (d.website) {
                  <a href="{{ d.website }}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[#58a6ff] hover:underline">
                    <ng-icon name="octLink" style="font-size:16px;width:16px;height:16px" />
                    {{ formatWebsite(d.website) }}
                  </a>
                }
                @if (d.twitter) {
                  <a href="https://twitter.com/{{ d.twitter.replace('@', '') }}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[#58a6ff] hover:underline">
                    <ng-icon name="lucideTwitter" style="font-size:16px;width:16px;height:16px" />
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
                      [routerLink]="['/github/repo', d.username, repo.name]"
                      class="border border-[#21262d] p-4 hover:bg-[#161b22]"
                    >
                      <div class="mb-1 flex items-center gap-2">
                        <ng-icon name="octRepo" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
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
                          <ng-icon name="octStar" style="font-size:14px;width:14px;height:14px" />
                          {{ formatNumber(repo.stars) }}
                        </span>
                        <span class="flex items-center gap-1 text-[#8b949e]">
                          <ng-icon name="octRepoForked" style="font-size:14px;width:14px;height:14px" />
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
                      [routerLink]="['/github/repo', d.username, repo.name]"
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
                              <ng-icon name="octStar" style="font-size:14px;width:14px;height:14px" />
                              {{ formatNumber(repo.stars) }}
                            </span>
                            <span class="flex items-center gap-1 text-[#8b949e]">
                              <ng-icon name="octRepoForked" style="font-size:14px;width:14px;height:14px" />
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
                <ng-icon name="octMarkGithub" style="font-size:16px;width:16px;height:16px" />
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
