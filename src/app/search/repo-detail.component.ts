import { Component, inject, signal, computed, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideGitFork, lucideStar } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SupabaseService, type DbGeneratedRepo } from '../core/services/supabase.service';
import { TRENDING_REPOS } from './trending-data';

@Component({
  selector: 'app-repo-detail',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideArrowLeft, lucideGitFork, lucideStar })],
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

      @if (repo(); as r) {
        <main class="mx-auto max-w-[1280px] px-6 py-6">
          <!-- Back link -->
          <a routerLink="/github" class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-[14px]">
            <ng-icon hlmIcon name="lucideArrowLeft" class="h-4 w-4" />
            Back to trending
          </a>

          <!-- Repo header -->
          <div class="mb-6">
            <div class="mb-2 flex items-center gap-3">
              <svg viewBox="0 0 16 16" class="text-muted-foreground h-5 w-5 fill-current">
                <path
                  d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                />
              </svg>
              <h1 class="text-foreground text-[24px] font-semibold">{{ r.owner }} / {{ r.name }}</h1>
              <span class="text-muted-foreground inline-block rounded-full border border-[#30363d] px-3 py-0.5 text-[12px] font-medium">
                Public
              </span>
            </div>
            <p class="text-muted-foreground max-w-[800px] text-[14px] leading-relaxed">
              {{ r.description }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="mb-6 flex flex-wrap items-center gap-3">
            <button
              hlmBtn
              variant="outline"
              class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
            >
              <ng-icon hlmIcon name="lucideStar" class="mr-1.5 h-4 w-4" />
              Star {{ formatNumber(r.stars) }}
            </button>
            <button
              hlmBtn
              variant="outline"
              class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
            >
              <ng-icon hlmIcon name="lucideGitFork" class="mr-1.5 h-4 w-4" />
              Fork {{ formatNumber(r.forks) }}
            </button>
            <button
              hlmBtn
              variant="outline"
              class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
            >
              <svg viewBox="0 0 16 16" class="mr-1.5 h-4 w-4 fill-current">
                <path
                  d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.5 7.5a.75.75 0 000-1.5H8.75V3.75a.75.75 0 00-1.5 0V7H4.75a.75.75 0 000 1.5H7.25v3.25a.75.75 0 001.5 0V8.5h2.75z"
                />
              </svg>
              Watch {{ formatNumber(r.watch) }}
            </button>
          </div>

          <!-- Two column layout -->
          <div class="flex flex-col gap-6 lg:flex-row">
            <!-- Left: File tree or File content -->
            <div class="min-w-0 flex-1">
              @if (selectedFile(); as file) {
                <!-- File content viewer -->
                <div class="border border-[#21262d]">
                  <div class="flex items-center justify-between border-b border-[#21262d] px-4 py-2">
                    <span class="text-foreground text-[14px] font-semibold">{{ file.name }}</span>
                    <button
                      class="text-muted-foreground hover:text-foreground text-[13px]"
                      (click)="selectedFile.set(null)"
                    >
                      ← Back to files
                    </button>
                  </div>
                  <pre class="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#e0e0e0]"><code>{{ file.content }}</code></pre>
                </div>
              } @else {
                <!-- File tree -->
                <div class="border border-[#21262d]">
                  <!-- Branch selector -->
                  <div class="border-b border-[#21262d] px-4 py-2">
                    <div class="flex items-center gap-2 text-[14px]">
                      <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                        <path
                          d="M9.5 3.25a2.25 2.25 0 11-3 2.122V6A2.5 2.5 0 005.5 8.5h.253a.25.25 0 01.2-.1l.816.306a.75.75 0 00.583 0l2.143-.794a.75.75 0 00.46.176h.28a2.25 2.25 0 010 1.5h-.28a.75.75 0 00-.46.176l-2.143.794a.75.75 0 01-.583 0l-.816-.306a.25.25 0 01-.2-.1H5.5a4 4 0 01-4-4v-.628A2.25 2.25 0 013.25 1h1.5zm5.75 0a.75.75 0 00-.75.75v.628c0 .245.132.476.344.6l.816.306a2.25 2.25 0 001.38.524h.28a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-.28a2.25 2.25 0 00-1.38.524l-.816.306a.25.25 0 01-.2.1H5.5a2.5 2.5 0 00-2.5 2.5v.628a2.25 2.25 0 01-1 1.932V13.25A1.75 1.75 0 001.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-2.5V4a.75.75 0 00-.75.75z"
                        />
                      </svg>
                      <span class="text-foreground font-semibold">{{ r.defaultBranch }}</span>
                    </div>
                  </div>

                  <!-- File list -->
                  @for (entry of fileTree(); track entry.name) {
                    <div
                      class="flex cursor-pointer items-center gap-3 border-b border-[#21262d] px-4 py-2.5 last:border-b-0 hover:bg-[#161b22]"
                      (click)="onFileClick(entry)"
                    >
                      <!-- Icon -->
                      @if (entry.type === 'folder') {
                        <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current" style="color: #54aeff">
                          <path
                            d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"
                          />
                        </svg>
                      } @else {
                        <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                          <path
                            d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06z"
                          />
                        </svg>
                      }

                      <!-- Name + last commit + date -->
                      <div class="min-w-0 flex-1">
                        <span class="text-foreground text-[14px]">{{ entry.name }}</span>
                      </div>
                      <span class="text-muted-foreground hidden truncate text-[13px] sm:block">{{ entry.lastCommit }}</span>
                      <span class="text-muted-foreground hidden w-[100px] shrink-0 text-right text-[13px] sm:block">{{ entry.date }}</span>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Right: About sidebar -->
            <div class="w-full shrink-0 lg:w-[296px]">
              <div class="border border-[#21262d] p-4">
                <h2 class="text-foreground mb-3 text-[16px] font-semibold">About</h2>
                <p class="text-muted-foreground mb-4 text-[14px] leading-relaxed">
                  {{ r.description }}
                </p>

                <!-- Stats -->
                <div class="mb-4 space-y-2">
                  <div class="flex items-center gap-2 text-[14px]">
                    <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                      <path
                        d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"
                      />
                    </svg>
                    <span class="text-foreground">{{ formatNumber(r.stars) }}</span>
                    <span class="text-muted-foreground">stars</span>
                  </div>
                  <div class="flex items-center gap-2 text-[14px]">
                    <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                      <path
                        d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      />
                    </svg>
                    <span class="text-foreground">{{ formatNumber(r.forks) }}</span>
                    <span class="text-muted-foreground">forks</span>
                  </div>
                  <div class="flex items-center gap-2 text-[14px]">
                    <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                      <path
                        d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.5 7.5a.75.75 0 000-1.5H8.75V3.75a.75.75 0 00-1.5 0V7H4.75a.75.75 0 000 1.5H7.25v3.25a.75.75 0 001.5 0V8.5h2.75z"
                      />
                    </svg>
                    <span class="text-foreground">{{ formatNumber(r.watch) }}</span>
                    <span class="text-muted-foreground">watching</span>
                  </div>
                </div>

                <!-- Language -->
                <div class="mb-4 flex items-center gap-2 text-[14px]">
                  <span
                    class="inline-block h-3 w-3 rounded-full"
                    [style.background-color]="r.languageColor"
                  ></span>
                  <span class="text-foreground">{{ r.language }}</span>
                </div>

                <!-- License -->
                <div class="mb-4 flex items-center gap-2 text-[14px]">
                  <svg viewBox="0 0 16 16" class="text-muted-foreground h-4 w-4 fill-current">
                    <path
                      d="M8.75.75V2a.75.75 0 01-1.5 0V.75a.75.75 0 011.5 0zM6.5 2.75a.75.75 0 00-1.5 0V3a.75.75 0 001.5 0V2.75zm4.5.75V2a.75.75 0 011.5 0v1.75a.75.75 0 01-1.5 0zM3.5 4A1.5 1.5 0 002 5.5v7A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 4h-9zM3 5.5A.5.5 0 013.5 5h9a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-7z"
                    />
                  </svg>
                  <span class="text-foreground">{{ r.license }}</span>
                </div>

                <!-- Topics -->
                @if (r.topics.length > 0) {
                  <div class="flex flex-wrap gap-1.5">
                    @for (topic of r.topics; track topic) {
                      <span class="inline-block rounded-full border border-[#388bfd26] bg-[#388bfd15] px-3 py-0.5 text-[12px] text-[#58a6ff]">
                        {{ topic }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- GitHub link -->
              <a
                href="https://github.com/{{ r.owner }}/{{ r.name }}"
                target="_blank"
                rel="noopener noreferrer"
                class="border-border text-foreground mt-4 flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-[14px] font-semibold hover:bg-[#161b22]"
              >
                <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current">
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                  />
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
          <div class="skeleton-shimmer mb-2 h-7 w-64 rounded"></div>
          <div class="skeleton-shimmer mb-6 h-4 w-full max-w-[600px] rounded"></div>
          <div class="flex gap-6">
            <div class="flex-1">
              <div class="border border-[#21262d] p-4">
                <div class="skeleton-shimmer mb-3 h-5 w-24 rounded"></div>
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <div class="skeleton-shimmer mb-2 h-10 w-full rounded"></div>
                }
              </div>
            </div>
            <div class="w-[296px]">
              <div class="border border-[#21262d] p-4">
                <div class="skeleton-shimmer mb-3 h-5 w-16 rounded"></div>
                <div class="skeleton-shimmer mb-2 h-4 w-full rounded"></div>
                <div class="skeleton-shimmer mb-2 h-4 w-3/4 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      }
    </div>
  `,
})
export class RepoDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly supabase = inject(SupabaseService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly generatedRepo = signal<DbGeneratedRepo | null>(null);
  protected readonly selectedFile = signal<{ name: string; content: string } | null>(null);

  protected readonly repo = computed(() => {
    const owner = this.route.snapshot.paramMap.get('owner') ?? '';
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    const generated = this.generatedRepo();
    if (generated && generated.owner === owner && generated.name === name) {
      return {
        owner: generated.owner,
        name: generated.name,
        description: generated.description,
        language: generated.language,
        languageColor: generated.language_color,
        stars: generated.stars,
        forks: generated.forks,
        watch: generated.watch,
        topics: generated.topics,
        license: generated.license,
        defaultBranch: generated.default_branch,
        fileTree: generated.files.map((f) => ({
          name: f.name,
          type: 'file' as const,
          lastCommit: f.name === 'index.html' ? 'Create index.html' : `Add ${f.name}`,
          date: new Date().toLocaleDateString('pt-BR'),
        })),
      };
    }
    return (
      TRENDING_REPOS.find((r) => r.owner === owner && r.name === name) ?? null
    );
  });

  protected readonly fileTree = computed(() => {
    const owner = this.route.snapshot.paramMap.get('owner') ?? '';
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    const generated = this.generatedRepo();
    if (generated && generated.owner === owner && generated.name === name) {
      return generated.files.map((f) => ({
        name: f.name,
        type: 'file' as const,
        lastCommit: f.name === 'index.html' ? 'Create index.html' : `Add ${f.name}`,
        date: new Date().toLocaleDateString('pt-BR'),
      }));
    }
    return this.repo()?.fileTree ?? [];
  });

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        this.loadGeneratedRepo();
      }
    });
  }

  private async loadGeneratedRepo(): Promise<void> {
    const owner = this.route.snapshot.paramMap.get('owner') ?? '';
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    const repo = await this.supabase.getGeneratedRepoByOwnerAndName(owner, name);
    if (repo) {
      this.generatedRepo.set(repo);
    }
  }

  onFileClick(entry: { name: string; type: string }): void {
    if (entry.type !== 'file') return;
    const generated = this.generatedRepo();
    if (!generated) return;
    const file = generated.files.find((f) => f.name === entry.name);
    if (file) {
      this.selectedFile.set({ name: file.name, content: file.content });
    }
  }

  formatNumber(n: number): string {
    if (n >= 1000) {
      return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    }
    return n.toString();
  }
}
