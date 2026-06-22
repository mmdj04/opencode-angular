import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { octIssueOpened, octIssueClosed, octComment } from '@ng-icons/octicons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

interface Issue {
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string;
  authorAvatar: string;
  labels: { name: string; color: string }[];
  comments: number;
  created: string;
}

const HARDCODED_ISSUES: Issue[] = [
  {
    number: 142,
    title: 'Eliminate redundant string allocations in request hot-path',
    state: 'open',
    author: 'arsenz',
    authorAvatar: '#2563eb',
    labels: [
      { name: 'performance', color: '#00cccc' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'to-triage', color: '#e99695' },
    ],
    comments: 2,
    created: '2 hours ago',
  },
  {
    number: 139,
    title: 'BUG REPORT',
    state: 'open',
    author: 'Oraboss',
    authorAvatar: '#dc2626',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'to-triage', color: '#e99695' },
    ],
    comments: 2,
    created: '3 hours ago',
  },
  {
    number: 136,
    title: 'Project dashboard disappeared from my account',
    state: 'open',
    author: 'jorgespensherrera-glitch',
    authorAvatar: '#059669',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'to-triage', color: '#e99695' },
    ],
    comments: 1,
    created: '6 hours ago',
  },
  {
    number: 126,
    title: 'Unhealthy',
    state: 'open',
    author: 'DaniloPortela-Mugo',
    authorAvatar: '#7c3aed',
    labels: [
      { name: 'awaiting-details', color: '#fbca04' },
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 1,
    created: '3 days ago',
  },
  {
    number: 100,
    title: 'Deploying functions from a branch tracked by the Github fail on path resolution',
    state: 'open',
    author: 'pjmv',
    authorAvatar: '#ea580c',
    labels: [
      { name: 'branching', color: '#0e8a16' },
      { name: 'bug', color: '#d73a4a' },
      { name: 'cli', color: '#5319e7' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 3,
    created: '1 week ago',
  },
  {
    number: 90,
    title: 'Studio misclassifies http:// auth hooks as Postgres hooks',
    state: 'open',
    author: 'peter941221',
    authorAvatar: '#4f46e5',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'frontend', color: '#d876e3' },
    ],
    comments: 5,
    created: '1 week ago',
  },
  {
    number: 87,
    title: 'Docs: stale auth hooks links still use removed hash anchors',
    state: 'open',
    author: 'peter941221',
    authorAvatar: '#4f46e5',
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'pr-opened', color: '#0e8a16' },
    ],
    comments: 2,
    created: '1 week ago',
  },
  {
    number: 84,
    title: 'Intermittent login delays and failures using Email/Password on Supabase Dashboard',
    state: 'open',
    author: 'CristianOlivera1',
    authorAvatar: '#0891b2',
    labels: [
      { name: 'awaiting-details', color: '#fbca04' },
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 5,
    created: '1 week ago',
  },
  {
    number: 75,
    title: 'There is no specific documentation provided for building android applications using React-Native CLI',
    state: 'open',
    author: 'Radhika08-v',
    authorAvatar: '#be185d',
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 3,
    created: '1 week ago',
  },
  {
    number: 64,
    title: 'update/remove podman(-compose) TODO about nested variable interpolation on docker-compose.yml',
    state: 'open',
    author: 'fatmalama',
    authorAvatar: '#16a34a',
    labels: [
      { name: 'external-issue', color: '#c5def5' },
      { name: 'self-hosted', color: '#fbca04' },
    ],
    comments: 4,
    created: '2 weeks ago',
  },
  {
    number: 46,
    title: '"Last used" indicator missing for legacy API keys',
    state: 'open',
    author: 'kahole',
    authorAvatar: '#9333ea',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'to-triage', color: '#e99695' },
    ],
    comments: 1,
    created: '2 weeks ago',
  },
  {
    number: 23,
    title: 'Can no longer login with Brave',
    state: 'open',
    author: 'zanethomas',
    authorAvatar: '#ca8a04',
    labels: [
      { name: 'auth', color: '#0550ae' },
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 2,
    created: '2 weeks ago',
  },
  {
    number: 21,
    title: 'DNS issue — ERR_NAME_NOT_RESOLVED',
    state: 'open',
    author: 'phongbui-nexcore',
    authorAvatar: '#dc2626',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
      { name: 'infra', color: '#6e7681' },
    ],
    comments: 4,
    created: '2 weeks ago',
  },
  {
    number: 18,
    title: 'GoTrue returns "Database error querying schema" on password auth after schema applied via direct psql',
    state: 'open',
    author: 'MaverickAAB',
    authorAvatar: '#2563eb',
    labels: [
      { name: 'branching', color: '#0e8a16' },
      { name: 'bug', color: '#d73a4a' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 1,
    created: '2 weeks ago',
  },
  {
    number: 15,
    title: 'Incorrect type import of SupabasePersistenceOptions in realtime monaco documentation',
    state: 'closed',
    author: 'GiridharRNair',
    authorAvatar: '#059669',
    labels: [
      { name: 'documentation', color: '#0075ca' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 5,
    created: '3 weeks ago',
  },
  {
    number: 9,
    title: 'PG 15 → 17 upgrade fails at completion ("pg_cron has no update path from 1.6 to 1.6.4"), leaves project with no valid restart target',
    state: 'closed',
    author: 'TomPelsz',
    authorAvatar: '#7c3aed',
    labels: [
      { name: 'bug', color: '#d73a4a' },
      { name: 'database', color: '#0550ae' },
      { name: 'external-issue', color: '#c5def5' },
    ],
    comments: 9,
    created: '3 weeks ago',
  },
  {
    number: 5,
    title: 'Performance regression in realtime joins after v2.45.0 upgrade',
    state: 'closed',
    author: 'devops-lead',
    authorAvatar: '#ea580c',
    labels: [
      { name: 'performance', color: '#00cccc' },
      { name: 'bug', color: '#d73a4a' },
    ],
    comments: 7,
    created: '1 month ago',
  },
  {
    number: 3,
    title: 'Add support for custom SMTP configuration in auth settings',
    state: 'closed',
    author: 'feature-bot',
    authorAvatar: '#16a34a',
    labels: [
      { name: 'enhancement', color: '#a2eeef' },
      { name: 'good first issue', color: '#7057ff' },
    ],
    comments: 4,
    created: '1 month ago',
  },
];

@Component({
  selector: 'app-issues',
  imports: [RouterLink, NgIcon, HlmButtonImports, HlmInputGroupImports, HlmInputImports],
  providers: [provideIcons({ lucideSearch, octIssueOpened, octIssueClosed, octComment })],
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

      <main class="mx-auto max-w-[1280px] px-6 py-6">
        <!-- Back link -->
        <a
          [routerLink]="['/github/repo', owner(), repoName()]"
          class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-[14px]"
        >
          ← Back to {{ owner() }}/{{ repoName() }}
        </a>

        <!-- Title row -->
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-foreground text-[24px] font-semibold">Issues</h1>
          <button
            hlmBtn
            class="bg-[#238636] text-[14px] font-semibold text-white hover:bg-[#2ea043]"
          >
            New issue
          </button>
        </div>

        <!-- Filter bar -->
        <div class="mb-4 flex items-center gap-3">
          <div hlmInputGroup class="max-w-[400px]">
            <hlm-input-group-addon align="inline-start">
              <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground" />
            </hlm-input-group-addon>
            <input
              hlmInputGroupInput
              type="search"
              placeholder="is:issue state:open"
              class="bg-[#0d1117]"
            />
          </div>
          <button
            hlmBtn
            variant="outline"
            class="border-[#30363d] bg-[#21262d] text-[13px] text-white hover:border-[#8b949e]"
          >
            Labels
          </button>
          <button
            hlmBtn
            variant="outline"
            class="border-[#30363d] bg-[#21262d] text-[13px] text-white hover:border-[#8b949e]"
          >
            Milestones
          </button>
        </div>

        <!-- Tabs -->
        <div class="mb-0 flex items-center gap-0 border border-[#21262d] bg-[#161b22]">
          <button
            class="flex items-center gap-2 border-b-2 px-4 py-3 text-[14px] font-semibold"
            [class]="
              filter() === 'open'
                ? 'border-[#f78166] text-white'
                : 'border-transparent text-[#8b949e] hover:text-white'
            "
            (click)="filter.set('open')"
          >
            <ng-icon hlmIcon name="octIssueOpened" class="h-4 w-4 text-[#3fb950]" />
            Open
            <span class="text-[#8b949e]">{{ openCount() }}</span>
          </button>
          <button
            class="flex items-center gap-2 border-b-2 px-4 py-3 text-[14px] font-semibold"
            [class]="
              filter() === 'closed'
                ? 'border-[#f78166] text-white'
                : 'border-transparent text-[#8b949e] hover:text-white'
            "
            (click)="filter.set('closed')"
          >
            <ng-icon hlmIcon name="octIssueClosed" class="h-4 w-4 text-[#8b949e]" />
            Closed
            <span class="text-[#8b949e]">{{ closedCount() }}</span>
          </button>
          <div class="flex-1"></div>
          <button
            hlmBtn
            variant="ghost"
            class="text-[13px] text-[#8b949e] hover:text-white"
          >
            Author ▾
          </button>
          <button
            hlmBtn
            variant="ghost"
            class="text-[13px] text-[#8b949e] hover:text-white"
          >
            Label ▾
          </button>
          <button
            hlmBtn
            variant="ghost"
            class="text-[13px] text-[#8b949e] hover:text-white"
          >
            Projects ▾
          </button>
          <button
            hlmBtn
            variant="ghost"
            class="text-[13px] text-[#8b949e] hover:text-white"
          >
            Milestones ▾
          </button>
          <button
            hlmBtn
            variant="ghost"
            class="px-3 text-[13px] text-[#8b949e] hover:text-white"
          >
            ⋯
          </button>
        </div>

        <!-- Issue list -->
        <div class="border border-t-0 border-[#21262d]">
          @for (issue of filteredIssues(); track issue.number) {
            <div class="flex items-start gap-3 border-b border-[#21262d] px-4 py-4 last:border-b-0 hover:bg-[#161b22]">
              <!-- State icon -->
              @if (issue.state === 'open') {
                <ng-icon hlmIcon name="octIssueOpened" class="mt-0.5 h-4 w-4 text-[#3fb950]" />
              } @else {
                <ng-icon hlmIcon name="octIssueClosed" class="mt-0.5 h-4 w-4 text-[#8b949e]" />
              }

              <!-- Content -->
              <div class="min-w-0 flex-1">
                <div class="mb-1 flex flex-wrap items-center gap-2">
                  <span class="text-foreground text-[16px] font-semibold">
                    {{ issue.title }}
                  </span>
                  @for (label of issue.labels; track label.name) {
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                      [style.background-color]="label.color"
                    >
                      {{ label.name }}
                    </span>
                  }
                </div>
                <div class="text-muted-foreground flex items-center gap-2 text-[12px]">
                  <span>#{{ issue.number }}</span>
                  <span>opened {{ issue.created }} by</span>
                  <a
                    [routerLink]="['/github/dev', issue.author]"
                    class="text-[#8b949e] hover:text-[#58a6ff]"
                  >
                    {{ issue.author }}
                  </a>
                </div>
              </div>

              <!-- Comments -->
              @if (issue.comments > 0) {
                <div class="flex shrink-0 items-center gap-1 text-[12px] text-[#8b949e]">
                  <ng-icon hlmIcon name="octComment" class="h-4 w-4" />
                  {{ issue.comments }}
                </div>
              }

              <!-- Avatar -->
              <div
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                [style.background-color]="issue.authorAvatar"
              >
                {{ issue.author.charAt(0).toUpperCase() }}
              </div>
            </div>
          }
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-border mt-8 border-t">
        <div class="mx-auto max-w-[1280px] px-6 py-6">
          <div class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-[13px]">
            <span>© 2026 Agentwork</span>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">About</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class IssuesComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly owner = computed(() => this.route.snapshot.paramMap.get('owner') ?? '');
  protected readonly repoName = computed(() => this.route.snapshot.paramMap.get('name') ?? '');
  protected readonly filter = signal<'open' | 'closed'>('open');

  protected readonly openCount = computed(() => HARDCODED_ISSUES.filter((i) => i.state === 'open').length);
  protected readonly closedCount = computed(() => HARDCODED_ISSUES.filter((i) => i.state === 'closed').length);

  protected readonly filteredIssues = computed(() => {
    return HARDCODED_ISSUES.filter((i) => i.state === this.filter());
  });
}
