import { Component, inject, signal, computed, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  octRepo,
  octStar,
  octStarFill,
  octRepoForked,
  octFile,
  octFileDirectory,
  octMarkGithub,
  octGitBranch,
  octLaw,
  octArrowLeft,
  octCode,
  octIssueOpened,
  octGitPullRequest,
  octEye,
} from '@ng-icons/octicons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SupabaseService, type DbGeneratedRepo } from '../core/services/supabase.service';

const LINK_INTERCEPTOR = `
<base target="_blank">
<script>
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#') && !link.getAttribute('href').startsWith('javascript:')) {
      e.preventDefault();
    }
  });
</script>`;

@Component({
  selector: 'app-repo-detail',
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [
    provideIcons({
      octRepo,
      octStar,
      octStarFill,
      octRepoForked,
      octFile,
      octFileDirectory,
      octMarkGithub,
      octGitBranch,
      octLaw,
      octArrowLeft,
      octCode,
      octIssueOpened,
      octGitPullRequest,
      octEye,
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

      @if (repo(); as r) {
        <main class="mx-auto max-w-[1280px] px-6 py-6">
          <!-- Back link -->
          <a routerLink="/github" class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-[14px]">
            <ng-icon name="octArrowLeft" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
            Back to trending
          </a>

          <!-- Repo header -->
          <div class="mb-4">
            <div class="mb-2 flex items-center gap-3">
              <ng-icon name="octRepo" class="text-muted-foreground" style="font-size:20px;width:20px;height:20px" />
              <h1 class="text-foreground text-[24px] font-semibold">{{ r.owner }} / {{ r.name }}</h1>
              <span class="text-muted-foreground inline-block rounded-full border border-[#30363d] px-3 py-0.5 text-[12px] font-medium">
                Public
              </span>
            </div>
            <p class="text-muted-foreground max-w-[800px] text-[14px] leading-relaxed">
              {{ r.description }}
            </p>
          </div>

          <!-- Repo nav tabs -->
          <nav class="mb-6 flex items-center gap-4 border-b border-[#21262d] pb-px text-[14px]">
            <span
              class="border-b-2 pb-3 pt-2 flex items-center gap-1.5 cursor-pointer transition-colors"
              [class.border-primary]="activeTab() === 'code'"
              [class.text-foreground]="activeTab() === 'code'"
              [class.font-semibold]="activeTab() === 'code'"
              [class.border-transparent]="activeTab() !== 'code'"
              [class.text-[#8b949e]]="activeTab() !== 'code'"
              (click)="activeTab.set('code'); selectedFile.set(null)"
            >
              <ng-icon name="octCode" style="font-size:16px;width:16px;height:16px" />
              Code
            </span>
            <a
              [routerLink]="['/github/repo', r.owner, r.name, 'issues']"
              class="border-b-2 border-transparent pb-3 pt-2 text-[#8b949e] hover:text-white flex items-center gap-1.5"
            >
              <ng-icon name="octIssueOpened" style="font-size:16px;width:16px;height:16px" />
              Issues
            </a>
            <span class="border-b-2 border-transparent pb-3 pt-2 text-[#8b949e] flex items-center gap-1.5">
              <ng-icon name="octGitPullRequest" style="font-size:16px;width:16px;height:16px" />
              Pull requests
            </span>
            <span
              class="border-b-2 pb-3 pt-2 flex items-center gap-1.5 cursor-pointer transition-colors"
              [class.border-primary]="activeTab() === 'preview'"
              [class.text-foreground]="activeTab() === 'preview'"
              [class.font-semibold]="activeTab() === 'preview'"
              [class.border-transparent]="activeTab() !== 'preview'"
              [class.text-[#8b949e]]="activeTab() !== 'preview'"
              (click)="activeTab.set('preview'); selectedFile.set(null)"
            >
              <ng-icon name="octEye" style="font-size:16px;width:16px;height:16px" />
              Preview
            </span>
          </nav>

          <!-- Action buttons -->
          <div class="mb-6 flex flex-wrap items-center gap-3">
            <button
              hlmBtn
              variant="outline"
              class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
            >
              <ng-icon name="octStar" class="mr-1.5 text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
              Star {{ formatNumber(r.stars) }}
            </button>
            <button
              hlmBtn
              variant="outline"
              class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
            >
              <ng-icon name="octRepoForked" class="mr-1.5 text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
              Fork {{ formatNumber(r.forks) }}
            </button>
            <button
              hlmBtn
              variant="outline"
              class="border-[#30363d] bg-[#21262d] text-[14px] font-semibold text-white hover:border-[#8b949e] hover:bg-[#30363d]"
            >
              <ng-icon name="octEye" class="mr-1.5 text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
              Watch {{ formatNumber(r.watch) }}
            </button>
          </div>

          <!-- Two column layout -->
          <div class="flex flex-col gap-6 lg:flex-row">
            <!-- Left: Main content area -->
            <div class="min-w-0 flex-1">
              @if (activeTab() === 'preview') {
                <!-- GLOBAL PREVIEW: site completo -->
                <div class="border border-[#21262d]">
                  <div class="border-b border-[#21262d] px-4 py-2">
                    <span class="text-foreground text-[14px] font-semibold">Preview</span>
                  </div>
                  @if (assembledSrcdoc()) {
                    <iframe
                      [srcdoc]="assembledSrcdoc()"
                      sandbox="allow-scripts allow-same-origin"
                      class="h-[calc(100vh-200px)] w-full border-0 bg-background"
                    ></iframe>
                  } @else {
                    <div class="flex flex-col items-center justify-center py-12 text-center">
                      <p class="text-muted-foreground text-[14px]">No HTML files to preview</p>
                    </div>
                  }
                </div>
              } @else if (selectedFile(); as file) {
                <!-- File content viewer -->
                <div class="border border-[#21262d]">
                  <div class="flex items-center justify-between border-b border-[#21262d] px-4 py-2">
                    <div class="flex items-center gap-3">
                      <span class="text-foreground text-[14px] font-semibold">{{ file.name }}</span>
                      @if (isHtmlFile()) {
                        <div class="flex items-center gap-1 rounded-md border border-[#30363d] bg-[#161b22] p-0.5">
                          <button
                            class="rounded px-2.5 py-1 text-[12px] font-medium transition-colors"
                            [class]="previewMode() === 'code' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'"
                            (click)="previewMode.set('code')"
                          >
                            Code
                          </button>
                          <button
                            class="rounded px-2.5 py-1 text-[12px] font-medium transition-colors"
                            [class]="previewMode() === 'preview' ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'"
                            (click)="previewMode.set('preview')"
                          >
                            Preview
                          </button>
                        </div>
                      }
                    </div>
                    <button
                      class="text-muted-foreground hover:text-foreground text-[13px]"
                      (click)="selectedFile.set(null); previewMode.set('code')"
                    >
                      ← Back to files
                    </button>
                  </div>
                  @if (previewMode() === 'code' || !isHtmlFile()) {
                    <pre class="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#e0e0e0]"><code>{{ file.content }}</code></pre>
                  } @else {
                    <iframe
                      [srcdoc]="safeSrcdoc()"
                      sandbox="allow-scripts allow-same-origin"
                      class="h-[calc(100vh-200px)] w-full border-0 bg-background"
                    ></iframe>
                  }
                </div>
              } @else {
                <!-- File tree -->
                <div class="border border-[#21262d]">
                  <!-- Branch selector -->
                  <div class="border-b border-[#21262d] px-4 py-2">
                    <div class="flex items-center gap-2 text-[14px]">
                      <ng-icon name="octGitBranch" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
                      <span class="text-foreground font-semibold">{{ r.defaultBranch }}</span>
                    </div>
                  </div>

                  <!-- File list -->
                  @for (entry of fileTree(); track entry.name) {
                    <div
                      class="flex cursor-pointer items-center gap-3 border-b border-[#21262d] px-4 py-2.5 last:border-b-0 hover:bg-[#161b22]"
                      (click)="onFileClick(entry)"
                    >
                      @if (entry.type === 'folder') {
                        <ng-icon name="octFileDirectory" class="text-[#54aeff]" style="font-size:16px;width:16px;height:16px" />
                      } @else {
                        <ng-icon name="octFile" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
                      }
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
                    <ng-icon name="octStarFill" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
                    <span class="text-foreground">{{ formatNumber(r.stars) }}</span>
                    <span class="text-muted-foreground">stars</span>
                  </div>
                  <div class="flex items-center gap-2 text-[14px]">
                    <ng-icon name="octRepoForked" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
                    <span class="text-foreground">{{ formatNumber(r.forks) }}</span>
                    <span class="text-muted-foreground">forks</span>
                  </div>
                  <div class="flex items-center gap-2 text-[14px]">
                    <ng-icon name="octEye" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
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
                  <ng-icon name="octLaw" class="text-muted-foreground" style="font-size:16px;width:16px;height:16px" />
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
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly generatedRepo = signal<DbGeneratedRepo | null>(null);
  protected readonly selectedFile = signal<{ name: string; content: string } | null>(null);
  protected readonly previewMode = signal<'code' | 'preview'>('code');
  protected readonly activeTab = signal<'code' | 'preview'>('code');

  protected readonly isHtmlFile = computed(() => {
    const file = this.selectedFile();
    return file?.name.endsWith('.html') ?? false;
  });

  private injectLinkInterceptor(html: string): string {
    if (html.includes('<head>')) {
      return html.replace('<head>', '<head>' + LINK_INTERCEPTOR);
    }
    if (html.includes('<html')) {
      return html.replace(/<html[^>]*>/, '$&<head>' + LINK_INTERCEPTOR + '</head>');
    }
    return LINK_INTERCEPTOR + html;
  }

  protected readonly safeSrcdoc = computed(() => {
    const file = this.selectedFile();
    if (!file || !file.name.endsWith('.html')) return '';
    return this.sanitizer.bypassSecurityTrustHtml(this.injectLinkInterceptor(file.content));
  });

  protected readonly assembledSrcdoc = computed(() => {
    const generated = this.generatedRepo();
    if (!generated) return '';

    const files = generated.files;
    const htmlFile =
      files.find((f) => (f.name || f.path) === 'index.html') ??
      files.find((f) => (f.name || f.path || '').endsWith('.html'));
    if (!htmlFile) return '';

    let html = htmlFile.content;

    // Inline CSS: <link rel="stylesheet" href="style.css"> → <style>...</style>
    html = html.replace(
      /<link\s+[^>]*href=["']([^"']+\.css)["'][^>]*\/?>/gi,
      (_, cssPath: string) => {
        const cssFileName = cssPath.split('/').pop() ?? cssPath;
        const cssFile = files.find(
          (f) => (f.name || f.path) === cssPath || (f.name || f.path) === cssFileName || (f.name || f.path || '').endsWith('/' + cssPath),
        );
        return cssFile ? `<style>${cssFile.content}</style>` : '';
      },
    );

    // Inline JS: <script src="script.js"></script> → <script>...</script>
    html = html.replace(
      /<script\s+[^>]*src=["']([^"']+\.js)["'][^>]*>\s*<\/script>/gi,
      (_, jsPath: string) => {
        const jsFileName = jsPath.split('/').pop() ?? jsPath;
        const jsFile = files.find(
          (f) => (f.name || f.path) === jsPath || (f.name || f.path) === jsFileName || (f.name || f.path || '').endsWith('/' + jsPath),
        );
        return jsFile ? `<script>${jsFile.content}</script>` : '';
      },
    );

    // Inject link interceptor
    html = this.injectLinkInterceptor(html);

    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

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
          name: f.name || f.path || 'arquivo',
          type: (f.type || 'file') as 'file' | 'folder',
          lastCommit: (f.name || f.path) === 'index.html' ? 'Create index.html' : `Add ${f.name || f.path}`,
          date: new Date().toLocaleDateString('pt-BR'),
        })),
      };
    }
    return null;
  });

  protected readonly fileTree = computed(() => {
    const owner = this.route.snapshot.paramMap.get('owner') ?? '';
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    const generated = this.generatedRepo();
    if (generated && generated.owner === owner && generated.name === name) {
      return generated.files.map((f) => ({
        name: f.name || f.path || 'arquivo',
        type: (f.type || 'file') as 'file' | 'folder',
        lastCommit: (f.name || f.path) === 'index.html' ? 'Create index.html' : `Add ${f.name || f.path}`,
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
    const file = generated.files.find((f) => (f.name || f.path) === entry.name);
    if (file) {
      this.selectedFile.set({ name: file.name || file.path || 'arquivo', content: file.content });
      this.previewMode.set('code');
      this.activeTab.set('code');
    }
  }

  formatNumber(n: number): string {
    if (n >= 1000) {
      return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    }
    return n.toString();
  }
}
