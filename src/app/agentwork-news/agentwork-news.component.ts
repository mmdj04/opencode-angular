import { Component, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { AgentworkNewsService } from './agentwork-news.service';
import { BannerService } from '../core/services/banner.service';

@Component({
  selector: 'app-agentwork-news',
  imports: [
    RouterLink,
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmTabsImports,
  ],
  providers: [
    provideIcons({
      lucideSettings,
    }),
  ],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div class="flex items-center gap-8">
            <a routerLink="/agentwork-news" class="flex items-center gap-1">
              <span class="text-foreground text-[28px] font-bold tracking-tight">Agentwork News</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Tabs + Feed -->
      <section class="mx-auto max-w-6xl px-6">
        <nav
          hlmTabs
          [tab]="activeTab()"
          class="border-border border-b"
          (tabActivated)="activeTab.set($event)"
        >
          <div class="flex items-center justify-between">
            <div hlmTabsList variant="line">
              @for (tab of news.tabs; track tab.id) {
                <button hlmTabsTrigger [hlmTabsTrigger]="tab.id">{{ tab.label }}</button>
              }
            </div>
          </div>
        </nav>

        <!-- News Feed -->
        <div class="py-6">
          @if (news.articles().length > 0) {
            <!-- Featured Article -->
            @if (featuredArticle(); as article) {
              <div class="mb-6">
                <a [routerLink]="['/agentwork-news/news', article.slug]" class="block">
                  <hlm-card class="overflow-hidden transition-shadow hover:shadow-md">
                    <div class="flex flex-col md:flex-row">
                      <div class="flex h-[280px] w-full items-center justify-center md:w-1/2">
                        <svg
                          class="banner-svg h-full w-full"
                          [attr.data-category]="article.category"
                        ></svg>
                      </div>
                      <div class="flex flex-1 flex-col justify-center p-6">
                        <hlm-badge variant="secondary" class="mb-2 w-fit">Featured</hlm-badge>
                        <h2 class="text-foreground mb-2 text-xl leading-snug font-semibold">
                          {{ article.title }}
                        </h2>
                        <p class="text-muted-foreground mb-3 text-sm leading-relaxed">
                          {{ article.snippet }}
                        </p>
                        <div class="flex items-center gap-2 text-xs">
                          <span class="text-muted-foreground">{{ article.source }}</span>
                          <span class="text-muted-foreground">·</span>
                          <span class="text-muted-foreground">{{ article.time }}</span>
                        </div>
                      </div>
                    </div>
                  </hlm-card>
                </a>
              </div>
            }

            <!-- Article Grid -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (article of filteredArticles(); track article.id) {
                <a [routerLink]="['/agentwork-news/news', article.slug]" class="block">
                  <hlm-card class="cursor-pointer transition-shadow hover:shadow-md">
                    <div class="flex h-[160px] items-center justify-center">
                      <svg
                        class="banner-svg h-full w-full"
                        [attr.data-category]="article.category"
                      ></svg>
                    </div>
                    <div class="p-4">
                      <h3
                        class="text-foreground mb-1 line-clamp-2 text-sm leading-snug font-semibold"
                      >
                        {{ article.title }}
                      </h3>
                      <p class="text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed">
                        {{ article.snippet }}
                      </p>
                      <div class="flex items-center gap-2 text-[11px]">
                        <span class="text-muted-foreground">{{ article.source }}</span>
                        <span class="text-muted-foreground">·</span>
                        <span class="text-muted-foreground">{{ article.time }}</span>
                      </div>
                    </div>
                  </hlm-card>
                </a>
              }
            </div>
          } @else {
            <!-- Empty State -->
            <div class="py-16 text-center">
              <p class="text-muted-foreground mb-4 text-lg">
                No articles yet. Configure your AI agent to generate tech news.
              </p>
              <a hlmBtn routerLink="/settings">
                <ng-icon hlmIcon name="lucideSettings" class="mr-2" />
                Go to Settings
              </a>
            </div>
          }
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-6xl px-6 py-6">
          <div
            class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-xs"
          >
            <span>© 2026 Agentwork</span>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">About</a>
            <a href="#" class="hover:underline">Help</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class AgentworkNewsComponent implements AfterViewInit {
  protected readonly news = inject(AgentworkNewsService);
  private readonly bannerService = inject(BannerService);
  protected readonly activeTab = signal('discover');
  private readonly isBrowser: boolean;

  protected readonly featuredArticle = signal(this.news.articles()[0]);
  protected readonly filteredArticles = signal(this.news.articles().slice(1));

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.news.init().then(() => {
      this.featuredArticle.set(this.news.articles()[0]);
      this.filteredArticles.set(this.news.articles().slice(1));
      if (this.isBrowser) {
        setTimeout(() => this.renderBanners(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.renderBanners();
    }
  }

  private renderBanners(): void {
    const svgs = document.querySelectorAll('.banner-svg');
    svgs.forEach((svg) => {
      const el = svg as SVGSVGElement;
      const category = el.getAttribute('data-category') ?? 'tech';
      const rect = el.parentElement?.getBoundingClientRect();
      const w = rect?.width ?? 400;
      const h = rect?.height ?? 200;
      el.innerHTML = '';
      this.bannerService.generate(el, { width: w, height: h, category });
    });
  }
}
