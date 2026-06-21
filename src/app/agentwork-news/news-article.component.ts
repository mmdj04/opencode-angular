import { Component, inject, signal, computed, afterNextRender } from '@angular/core';
import type { OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NewsArticleService, type NewsArticleDetail, type RelatedArticle } from './news-article.service';
import { MermaidDiagramComponent } from './mermaid-diagram.component';

@Component({
  selector: 'app-news-article',
  imports: [
    RouterLink,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparatorImports,
    MermaidDiagramComponent,
  ],
  template: `
    @if (article() === 'loading') {
      <div class="mx-auto max-w-4xl px-6 py-12">
        <div class="skeleton-shimmer bg-muted mb-4 h-4 w-32 rounded"></div>
        <div class="skeleton-shimmer bg-muted mb-3 h-8 w-3/4 rounded"></div>
        <div class="skeleton-shimmer bg-muted mb-2 h-4 w-full rounded"></div>
        <div class="skeleton-shimmer bg-muted mb-2 h-4 w-5/6 rounded"></div>
        <div class="skeleton-shimmer bg-muted mb-8 h-4 w-2/3 rounded"></div>
        <div class="skeleton-shimmer bg-muted h-64 w-full rounded"></div>
      </div>
    } @else if (article() === 'not-found') {
      <div class="mx-auto max-w-4xl px-6 py-12 text-center">
        <p class="text-muted-foreground mb-4 text-lg">Article not found.</p>
        <a hlmBtn routerLink="/agentwork-news">← Back</a>
      </div>
    } @else if (articleData(); as art) {
      <article class="mx-auto max-w-4xl px-6 py-12">
        <div class="mb-4">
          <hlm-badge variant="secondary">{{ art.categoryLabel }}</hlm-badge>
        </div>

        <h1 class="text-foreground mb-4 text-3xl leading-tight font-bold md:text-4xl">
          {{ art.title }}
        </h1>

        <p class="text-muted-foreground mb-6 text-lg leading-relaxed">{{ art.subtitle }}</p>

        <div class="text-muted-foreground mb-8 flex items-center gap-3 text-sm">
          <span class="font-medium">{{ art.source }}</span>
          <span>·</span>
          <span>{{ art.date }}</span>
          <span>·</span>
          <span>{{ art.readTime }}</span>
        </div>

        <hlm-separator class="mb-8" />

        @if (art.diagrams && art.diagrams.length > 0) {
          <div class="mb-8 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
            <app-mermaid-diagram [code]="art.diagrams[0]?.code ?? ''" [caption]="art.diagrams[0]?.caption ?? ''" />
          </div>
        }

        <div class="prose-custom">
          @for (paragraph of art.paragraphs; track $index) {
            @if (paragraph.isSubtitle) {
              <h2 class="text-foreground mt-10 mb-4 text-xl font-semibold">
                {{ paragraph.text }}
              </h2>
            } @else {
              <p class="text-foreground/90 mb-4 text-base leading-relaxed">
                {{ paragraph.text }}
              </p>
            }

            @if (
              art.diagrams &&
              art.diagrams.length > 1 &&
              $index > 0 &&
              $index % 3 === 0 &&
              getDiagramIndex($index, art.diagrams.length) < art.diagrams.length
            ) {
              <div class="my-6 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
                <app-mermaid-diagram
                  [code]="art.diagrams[getDiagramIndex($index, art.diagrams.length)]?.code ?? ''"
                  [caption]="art.diagrams[getDiagramIndex($index, art.diagrams.length)]?.caption ?? ''"
                />
              </div>
            }
          }
        </div>

        @if (art.tags && art.tags.length > 0) {
          <div class="mt-10 flex flex-wrap gap-2">
            @for (tag of art.tags; track tag) {
              <hlm-badge variant="outline">{{ tag }}</hlm-badge>
            }
          </div>
        }

        <hlm-separator class="my-10" />

        @if (related().length > 0) {
          <h2 class="text-foreground mb-4 text-lg font-semibold">Related</h2>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            @for (rel of related(); track rel.id) {
              <a [routerLink]="['/agentwork-news/news', rel.slug]" class="block">
                <hlm-card class="cursor-pointer transition-shadow hover:shadow-md">
                  <div class="p-4">
                    <h3 class="text-foreground mb-1 line-clamp-2 text-sm leading-snug font-semibold">
                      {{ rel.title }}
                    </h3>
                    <p class="text-muted-foreground mb-2 line-clamp-2 text-xs leading-relaxed">
                      {{ rel.snippet }}
                    </p>
                    <div class="flex items-center gap-2 text-[11px]">
                      <span class="text-muted-foreground">{{ rel.source }}</span>
                      <span class="text-muted-foreground">·</span>
                      <span class="text-muted-foreground">{{ rel.time }}</span>
                    </div>
                  </div>
                </hlm-card>
              </a>
            }
          </div>
        }
      </article>
    }
  `,
})
export class NewsArticleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly articleSvc = inject(NewsArticleService);

  protected readonly article = signal<'loading' | NewsArticleDetail | 'not-found'>('loading');
  protected readonly related = signal<RelatedArticle[]>([]);
  protected readonly articleData = computed(() => {
    const val = this.article();
    return val !== 'loading' && val !== 'not-found' ? val : null;
  });

  constructor() {
    afterNextRender(async () => {
      const slug = this.route.snapshot.paramMap.get('slug') ?? '';
      if (!slug) {
        this.article.set('not-found');
        return;
      }

      const [result, relatedResults] = await Promise.all([
        this.articleSvc.getArticle(slug),
        this.articleSvc.getRelatedArticles(slug),
      ]);

      if (result) {
        this.article.set(result);
      } else {
        this.article.set('not-found');
      }

      this.related.set(relatedResults);
    });
  }

  ngOnInit() {}

  getDiagramIndex(paragraphIndex: number, totalDiagrams: number): number {
    if (totalDiagrams <= 1) return 0;
    return 1 + Math.floor((paragraphIndex - 1) / 3);
  }
}
