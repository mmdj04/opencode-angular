import { Component, computed, inject, input, signal, Inject, PLATFORM_ID } from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClock,
  lucideFacebook,
  lucideLinkedin,
  lucideTwitter,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmBreadcrumbImports, HlmBreadcrumbLink } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NewsArticleService } from './news-article.service';
import type { NewsArticleDetail } from './news-article.service';
import { MermaidDiagramComponent } from './mermaid-diagram.component';
import { BannerService } from '../core/services/banner.service';

@Component({
  selector: 'app-news-article',
  imports: [
    RouterLink,
    NgIcon,
    HlmAvatarImports,
    HlmBadgeImports,
    HlmBreadcrumbImports,
    HlmBreadcrumbLink,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparatorImports,
    MermaidDiagramComponent,
  ],
  providers: [
    provideIcons({
      lucideClock,
      lucideFacebook,
      lucideLinkedin,
      lucideTwitter,
    }),
  ],
  template: `
    @if (article() === 'loading') {
      <!-- Skeleton Loading -->
      <div class="bg-background min-h-screen">
        <header class="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
          <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <a routerLink="/agentwork-news" class="flex items-center gap-1">
              <span class="text-foreground text-[28px] font-bold tracking-tight">Agentwork News</span>
            </a>
          </div>
        </header>
        <article class="mx-auto max-w-3xl px-6 py-8">
          <div class="mb-6 flex gap-2">
            <div class="skeleton-shimmer h-4 w-16"></div>
            <div class="skeleton-shimmer h-4 w-24"></div>
          </div>
          <div class="mb-4 flex gap-3">
            <div class="skeleton-shimmer h-6 w-16"></div>
            <div class="skeleton-shimmer h-4 w-24"></div>
          </div>
          <div class="skeleton-shimmer mb-3 h-10 w-full"></div>
          <div class="skeleton-shimmer mb-3 h-10 w-3/4"></div>
          <div class="skeleton-shimmer mb-6 h-6 w-full"></div>
          <div class="mb-6 flex items-center gap-3">
            <div class="skeleton-shimmer h-10 w-10 rounded-full"></div>
            <div>
              <div class="skeleton-shimmer mb-1 h-4 w-32"></div>
              <div class="skeleton-shimmer h-3 w-40"></div>
            </div>
          </div>
          <div class="skeleton-shimmer mb-8 h-px w-full"></div>
          <div class="skeleton-shimmer mb-8 h-[300px] w-full rounded-lg md:h-[400px]"></div>
          <div class="space-y-4">
            <div class="skeleton-shimmer h-4 w-full"></div>
            <div class="skeleton-shimmer h-4 w-full"></div>
            <div class="skeleton-shimmer h-4 w-5/6"></div>
            <div class="skeleton-shimmer mt-6 h-6 w-1/2"></div>
            <div class="skeleton-shimmer h-4 w-full"></div>
            <div class="skeleton-shimmer h-4 w-full"></div>
            <div class="skeleton-shimmer h-4 w-4/5"></div>
            <div class="skeleton-shimmer h-4 w-full"></div>
            <div class="skeleton-shimmer h-4 w-2/3"></div>
          </div>
        </article>
      </div>
    } @else if (art()) {
      <div class="bg-background min-h-screen">
        <!-- Header -->
        <header class="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
          <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div class="flex items-center gap-4">
              <a routerLink="/agentwork-news" class="flex items-center gap-1">
                <span class="text-foreground text-[28px] font-bold tracking-tight">Agentwork News</span>
              </a>
            </div>
          </div>
        </header>

        <!-- Article -->
        <article class="mx-auto max-w-3xl px-6 py-8">
          <!-- Breadcrumb -->
          <nav hlmBreadcrumb class="mb-6">
            <ol hlmBreadcrumbList>
              <li hlmBreadcrumbItem>
                <a hlmBreadcrumbLink routerLink="/agentwork-news">Início</a>
              </li>
              <li hlmBreadcrumbItem>
                <span hlmBreadcrumbSeparator></span>
              </li>
              <li hlmBreadcrumbItem>
                <a hlmBreadcrumbLink routerLink="/agentwork-news">{{ art()!.categoryLabel }}</a>
              </li>
              <li hlmBreadcrumbItem>
                <span hlmBreadcrumbSeparator></span>
              </li>
              <li hlmBreadcrumbItem>
                <span hlmBreadcrumbPage class="line-clamp-1">{{ art()!.title }}</span>
              </li>
            </ol>
          </nav>

          <!-- Category + Date -->
          <div class="mb-4 flex items-center gap-3">
            <hlm-badge variant="secondary">{{ art()!.categoryLabel }}</hlm-badge>
            <div class="text-muted-foreground flex items-center gap-1 text-xs">
              <ng-icon hlmIcon name="lucideClock" class="size-3" />
              <span>{{ art()!.readTime }}</span>
            </div>
          </div>

          <!-- Title -->
          <h1 class="text-foreground mb-3 text-3xl leading-tight font-bold md:text-4xl">
            {{ art()!.title }}
          </h1>

          <!-- Subtitle -->
          <p class="text-muted-foreground mb-6 text-lg leading-relaxed">
            {{ art()!.subtitle }}
          </p>

          <!-- Author + Source -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <hlm-avatar>
                <span hlmAvatarFallback class="text-sm font-bold">{{ art()!.source[0] }}</span>
              </hlm-avatar>
              <div>
                <p class="text-foreground text-sm font-medium">{{ art()!.source }}</p>
                <p class="text-muted-foreground text-xs">Publicado em {{ art()!.date }}</p>
              </div>
            </div>
          </div>

          <div hlmSeparator class="mb-8"></div>

          <!-- Hero Image -->
          <div class="mb-8 overflow-hidden rounded-lg">
            <svg
              #heroBanner
              class="hero-banner h-[300px] w-full md:h-[400px]"
            ></svg>
          </div>

          <!-- Article Body -->
          <div class="prose-custom">
            @for (para of art()!.paragraphs; track $index) {
              @if (para.isSubtitle) {
                <h2 class="text-foreground mt-8 mb-3 text-xl font-semibold">
                  {{ para.text }}
                </h2>
              } @else {
                <p class="text-muted-foreground mb-4 text-base leading-[1.8]">
                  {{ para.text }}
                </p>
              }
            }
          </div>

          <!-- Diagrams -->
          @if (art()!.diagrams && art()!.diagrams.length > 0) {
            <div class="mt-8">
              @for (diagram of art()!.diagrams; track $index) {
                @if (diagram.type === 'mermaid') {
                  <app-mermaid-diagram
                    [code]="diagram.code"
                    [caption]="diagram.caption"
                  />
                }
              }
            </div>
          }

          <!-- Tags -->
          <div class="mt-8 flex flex-wrap gap-2">
            @for (tag of art()!.tags; track tag) {
              <hlm-badge variant="outline" class="cursor-pointer">{{ tag }}</hlm-badge>
            }
          </div>

          <div hlmSeparator class="my-8"></div>

          <!-- Share -->
          <div class="mb-8 flex items-center gap-4">
            <span class="text-foreground text-sm font-medium">Compartilhar:</span>
            <div class="flex items-center gap-2">
              <button hlmBtn variant="outline" size="icon-sm">
                <ng-icon hlmIcon name="lucideFacebook" />
              </button>
              <button hlmBtn variant="outline" size="icon-sm">
                <ng-icon hlmIcon name="lucideTwitter" />
              </button>
              <button hlmBtn variant="outline" size="icon-sm">
                <ng-icon hlmIcon name="lucideLinkedin" />
              </button>
            </div>
          </div>

          <div hlmSeparator class="mb-8"></div>

          <!-- Related Articles -->
          <section class="mb-8">
            <h2 class="text-foreground mb-4 text-xl font-semibold">Mais notícias</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              @for (related of relatedArticles(); track related.id) {
                <hlm-card class="cursor-pointer transition-shadow hover:shadow-md">
                  <div class="flex h-[100px] items-center justify-center">
                    <svg
                      class="banner-svg h-full w-full"
                      [attr.data-category]="related.category"
                    ></svg>
                  </div>
                  <div class="p-4">
                    <h3
                      class="text-foreground mb-1 line-clamp-2 text-sm leading-snug font-semibold"
                    >
                      {{ related.title }}
                    </h3>
                    <p class="text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed">
                      {{ related.snippet }}
                    </p>
                    <div class="flex items-center gap-2 text-[11px]">
                      <span class="text-muted-foreground">{{ related.source }}</span>
                      <span class="text-muted-foreground">·</span>
                      <span class="text-muted-foreground">{{ related.time }}</span>
                    </div>
                  </div>
                </hlm-card>
              }
            </div>
          </section>
        </article>

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
    } @else {
      <!-- 404 State -->
      <div class="bg-background flex min-h-screen items-center justify-center">
        <div class="text-center">
          <h1 class="text-foreground mb-2 text-2xl font-bold">Artigo não encontrado</h1>
          <p class="text-muted-foreground mb-4">O artigo que você procura não existe.</p>
          <a hlmBtn routerLink="/agentwork-news">Voltar ao Agentwork News</a>
        </div>
      </div>
    }
  `,
})
export class NewsArticleComponent implements AfterViewInit {
  private readonly articleService = inject(NewsArticleService);
  private readonly bannerService = inject(BannerService);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser: boolean;
  readonly slug = input.required<string>();

  protected readonly article = signal<NewsArticleDetail | 'loading' | 'not-found'>('loading');
  protected readonly relatedArticles = signal<import('./news-article.service').RelatedArticle[]>([]);
  protected readonly art = computed(() => {
    const v = this.article();
    return v !== 'loading' && v !== 'not-found' ? v : undefined;
  });

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.article.set('loading');
        this.articleService.getArticle(slug).then((a) => {
          if (a) {
            this.article.set(a);
            this.articleService.getRelatedArticles(slug).then((r) => {
              this.relatedArticles.set(r);
              setTimeout(() => {
                if (this.isBrowser) this.renderRelatedBanners();
              }, 0);
            });
            setTimeout(() => {
              if (this.isBrowser) this.renderHeroBanner(a.category);
            }, 0);
          } else {
            this.article.set('not-found');
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    const v = this.article();
    if (v && v !== 'loading' && v !== 'not-found') {
      this.renderHeroBanner(v.category);
    }
  }

  private renderHeroBanner(category: string): void {
    const svg = document.querySelector('.hero-banner') as SVGSVGElement | null;
    if (!svg) return;
    const rect = svg.parentElement?.getBoundingClientRect();
    const w = rect?.width ?? 800;
    const h = rect?.height ?? 400;
    svg.innerHTML = '';
    this.bannerService.generate(svg, { width: w, height: h, category });
  }

  private renderRelatedBanners(): void {
    const svgs = document.querySelectorAll('.banner-svg');
    svgs.forEach((svg) => {
      const el = svg as SVGSVGElement;
      const category = el.getAttribute('data-category') ?? 'tech';
      const rect = el.parentElement?.getBoundingClientRect();
      const w = rect?.width ?? 300;
      const h = rect?.height ?? 100;
      el.innerHTML = '';
      this.bannerService.generate(el, { width: w, height: h, category });
    });
  }
}
