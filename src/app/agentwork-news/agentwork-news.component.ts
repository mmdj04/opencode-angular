import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCloud,
  lucideMoreHorizontal,
  lucideSearch,
  lucideSettings,
  lucideSparkles,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { AgentworkNewsService } from './agentwork-news.service';

@Component({
  selector: 'app-agentwork-news',
  imports: [
    RouterLink,
    NgIcon,
    HlmAvatarImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmInputGroupImports,
    HlmSeparatorImports,
    HlmTabsImports,
  ],
  providers: [
    provideIcons({
      lucideSearch,
      lucideSettings,
      lucideCloud,
      lucideSparkles,
      lucideMoreHorizontal,
    }),
  ],
  template: `
    <div class="bg-background min-h-screen">
      <!-- Header -->
      <header class="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-1">
              <span class="text-foreground text-[28px] font-bold tracking-tight">Agentwork News</span>
            </a>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-sm">
              <ng-icon hlmIcon name="lucideCloud" class="text-muted-foreground" />
              <span class="text-muted-foreground">São Paulo</span>
              <span class="font-medium">28°C</span>
            </div>
            <button hlmBtn variant="ghost" size="icon-sm">
              <ng-icon hlmIcon name="lucideSettings" />
            </button>
            <button hlmBtn variant="outline" size="sm">Sign in</button>
          </div>
        </div>
      </header>

      <!-- Search + Quick Links -->
      <section class="mx-auto max-w-6xl px-6 pt-6 pb-4">
        <div hlmInputGroup class="mx-auto max-w-[580px]">
          <hlm-input-group-addon align="inline-start">
            <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground" />
          </hlm-input-group-addon>
          <input hlmInputGroupInput type="search" placeholder="Search the web" />
        </div>

        <!-- Quick Links -->
        <div class="mx-auto mt-6 flex max-w-[500px] items-center justify-center gap-6">
          @for (link of news.quickLinks; track link.name) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-2"
            >
              <hlm-avatar size="lg">
                <span hlmAvatarFallback class="text-sm font-bold">{{ link.name[0] }}</span>
              </hlm-avatar>
              <span class="text-muted-foreground text-[11px]">{{ link.name }}</span>
            </a>
          }
          <button hlmBtn variant="ghost" size="icon-sm">
            <ng-icon hlmIcon name="lucideMoreHorizontal" />
          </button>
        </div>
      </section>

      <div hlmSeparator class="my-2"></div>

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
              <button hlmTabsTrigger [hlmTabsTrigger]="'more'">
                <ng-icon hlmIcon name="lucideMoreHorizontal" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button hlmBtn variant="outline" size="sm">
                <ng-icon hlmIcon name="lucideSparkles" class="mr-1" />
                Personalize
              </button>
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
                      <div
                        class="bg-muted flex h-[280px] w-full items-center justify-center md:w-1/2"
                      >
                        <span class="text-muted-foreground text-4xl font-bold opacity-20">MSN</span>
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
                    <div class="bg-muted flex h-[160px] items-center justify-center">
                      <span class="text-muted-foreground text-2xl font-bold opacity-20">MSN</span>
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
export class AgentworkNewsComponent {
  protected readonly news = inject(AgentworkNewsService);
  protected readonly activeTab = signal('discover');

  protected readonly featuredArticle = signal(this.news.articles()[0]);

  protected readonly filteredArticles = signal(this.news.articles().slice(1));

  constructor() {
    this.news.init().then(() => {
      this.featuredArticle.set(this.news.articles()[0]);
      this.filteredArticles.set(this.news.articles().slice(1));
    });
  }
}
