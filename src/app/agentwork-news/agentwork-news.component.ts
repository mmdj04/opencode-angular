import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { AgentworkNewsService } from './agentwork-news.service';
import { MermaidDiagramComponent } from './mermaid-diagram.component';

const CATEGORY_BANNERS: Record<string, string> = {
  research: `graph TD
    A[Hipótese] --> B[Revisão de Literatura]
    B --> C[Metodologia]
    C --> D[Experimento]
    D --> E[Análise de Dados]
    E --> F[Publicação]`,
  docs: `graph LR
    A[Planejamento] --> B[Escrita]
    B --> C[Revisão Técnica]
    C --> D[Publicação]
    D --> E[Feedback]
    E --> F[Atualização]`,
  'deep-tech': `graph TD
    A[Teoria Quântica] --> B[Simulação]
    B --> C[Protótipo]
    C --> D[Experimento]
    D --> E[Descoberta]
    E --> F[Aplicação Prática]`,
  'ai-labs': `graph TD
    A[Problema] --> B[Coleta de Dados]
    B --> C[Treinamento]
    C --> D[Avaliação]
    D --> E[Deploy]
    E --> F[Monitoramento]`,
};

const CATEGORY_LABELS: Record<string, string> = {
  research: 'Pesquisa',
  docs: 'Documentação',
  'deep-tech': 'Deep Tech',
  'ai-labs': 'AI Labs',
};

@Component({
  selector: 'app-agentwork-news',
  imports: [
    RouterLink,
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmTabsImports,
    MermaidDiagramComponent,
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

        <!-- Category Banner -->
        <div class="py-6">
          @if (activeTab(); as tab) {
            <div class="mb-6 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <div class="mb-3 flex items-center gap-3">
                <hlm-badge variant="secondary">{{ getCategoryLabel(tab) }}</hlm-badge>
              </div>
              <app-mermaid-diagram
                [code]="getCategoryBanner(tab)"
                [caption]="getCategoryCaption(tab)"
              />
            </div>
          }
        </div>

        <!-- News Feed -->
        <div class="py-6">
          @if (filteredArticles().length > 0) {
            <!-- Featured Article -->
            @if (filteredArticles()[0]; as article) {
              <div class="mb-6">
                <a [routerLink]="['/agentwork-news/news', article.slug]" class="block">
                  <hlm-card class="overflow-hidden transition-shadow hover:shadow-md">
                    <div class="flex flex-col md:flex-row">
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
              @for (article of filteredArticles().slice(1); track article.id) {
                <a [routerLink]="['/agentwork-news/news', article.slug]" class="block">
                  <hlm-card class="cursor-pointer transition-shadow hover:shadow-md">
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
                Nenhum artigo ainda. Configure seu agente IA para gerar notícias.
              </p>
              <a hlmBtn routerLink="/settings">
                <ng-icon hlmIcon name="lucideSettings" class="mr-2" />
                Ir para Configurações
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
  protected readonly activeTab = signal('research');

  protected readonly filteredArticles = computed(() =>
    this.news.getArticlesByCategory(this.activeTab()),
  );

  getCategoryBanner(category: string): string {
    return CATEGORY_BANNERS[category] ?? CATEGORY_BANNERS['research']!;
  }

  getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? category;
  }

  getCategoryCaption(category: string): string {
    const captions: Record<string, string> = {
      research: 'Fluxo de pesquisa científica',
      docs: 'Pipeline de documentação técnica',
      'deep-tech': 'Ciclo de desenvolvimento em tecnologia de ponta',
      'ai-labs': 'Pipeline de desenvolvimento de IA',
    };
    return captions[category] ?? '';
  }
}
