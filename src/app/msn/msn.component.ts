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
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { MsnService } from './msn.service';

@Component({
  selector: 'app-msn',
  imports: [
    RouterLink,
    NgIcon,
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
      <header
        class="border-border sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-[#1a1a1a]/80"
      >
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-1">
              <span class="text-[28px] font-bold tracking-tight">
                <span class="text-[#f25022]">m</span><span class="text-[#7fba00]">s</span
                ><span class="text-[#00a4ef]">n</span>
              </span>
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
          @for (link of msn.quickLinks; track link.name) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-2"
            >
              <div class="bg-muted flex size-12 items-center justify-center rounded-full">
                <span class="text-foreground text-sm font-bold">{{ link.name[0] }}</span>
              </div>
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
              @for (tab of msn.tabs; track tab.id) {
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
          <!-- Featured Article -->
          @if (featuredArticle(); as article) {
            <div class="mb-6">
              <a [routerLink]="['/msn/news', article.slug]" class="block">
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
              <a [routerLink]="['/msn/news', article.slug]" class="block">
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
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-6xl px-6 py-6">
          <div class="flex flex-wrap items-center justify-center gap-4 text-xs text-[#9e9e9e]">
            <span>© 2026 Microsoft</span>
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
export class MsnComponent {
  protected readonly msn = inject(MsnService);
  protected readonly activeTab = signal('discover');

  protected readonly featuredArticle = signal(this.msn.articles[0]);

  protected readonly filteredArticles = signal(this.msn.articles.slice(1));
}
