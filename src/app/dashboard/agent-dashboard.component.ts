import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideBot,
  lucideCheckCircle,
  lucideClock,
  lucideLoader2,
  lucidePlay,
  lucideXCircle,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { AgentService } from '../core/services/agent.service';
import { AuthService } from '../core/services/auth.service';
import {
  SupabaseService,
  type DbAgentActivityLog,
  type DbAgentTask,
  type DbUserAgent,
} from '../core/services/supabase.service';

@Component({
  selector: 'app-agent-dashboard',
  imports: [RouterLink, NgIcon, HlmButtonImports, HlmCardImports],
  providers: [
    provideIcons({
      lucideBot,
      lucideActivity,
      lucideCheckCircle,
      lucideXCircle,
      lucideClock,
      lucidePlay,
      lucideLoader2,
    }),
  ],
  template: `
    <div class="bg-background min-h-screen p-4 md:p-8">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-foreground text-2xl font-bold tracking-tight">Agent Dashboard</h1>
            <p class="text-muted-foreground text-sm">Monitor autonomous agent activity</p>
          </div>
          <div class="flex gap-2">
            <a hlmBtn variant="outline" routerLink="/settings">
              <ng-icon hlmIcon name="lucideBot" class="mr-2 h-4 w-4" />
              Settings
            </a>
            <button hlmBtn (click)="runAllAgents()" [disabled]="isRunningAll()">
              @if (isRunningAll()) {
                <ng-icon hlmIcon name="lucideLoader2" class="mr-2 h-4 w-4 animate-spin" />
                Running...
              } @else {
                <ng-icon hlmIcon name="lucidePlay" class="mr-2 h-4 w-4" />
                Run All Agents
              }
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <hlm-card class="p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ng-icon hlmIcon name="lucideBot" class="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div class="text-foreground text-2xl font-bold">{{ agents().length }}</div>
                <div class="text-muted-foreground text-xs">Total Agents</div>
              </div>
            </div>
          </hlm-card>

          <hlm-card class="p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <ng-icon hlmIcon name="lucideCheckCircle" class="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div class="text-foreground text-2xl font-bold">{{ completedToday() }}</div>
                <div class="text-muted-foreground text-xs">Completed Today</div>
              </div>
            </div>
          </hlm-card>

          <hlm-card class="p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <ng-icon hlmIcon name="lucideClock" class="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <div class="text-foreground text-2xl font-bold">{{ pendingTasks().length }}</div>
                <div class="text-muted-foreground text-xs">Pending Tasks</div>
              </div>
            </div>
          </hlm-card>

          <hlm-card class="p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <ng-icon hlmIcon name="lucideXCircle" class="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div class="text-foreground text-2xl font-bold">{{ failedToday() }}</div>
                <div class="text-muted-foreground text-xs">Failed Today</div>
              </div>
            </div>
          </hlm-card>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Recent Activity -->
          <hlm-card>
            <div class="p-6">
              <h2 class="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <ng-icon hlmIcon name="lucideActivity" class="h-5 w-5" />
                Recent Activity
              </h2>

              @if (activityLogs().length === 0) {
                <div
                  class="text-muted-foreground rounded-md border border-dashed border-[#21262d] py-8 text-center text-sm"
                >
                  No activity yet. Run an agent to get started.
                </div>
              } @else {
                <div class="flex flex-col gap-3">
                  @for (log of activityLogs().slice(0, 10); track log.id) {
                    <div class="flex items-start gap-3 rounded-md border border-[#21262d] p-3">
                      <div class="mt-0.5">
                        @switch (log.action) {
                          @case ('create_project') {
                            <ng-icon hlmIcon name="lucideBot" class="h-4 w-4 text-blue-400" />
                          }
                          @case ('create_issue') {
                            <ng-icon hlmIcon name="lucideXCircle" class="h-4 w-4 text-yellow-400" />
                          }
                          @case ('create_pr') {
                            <ng-icon
                              hlmIcon
                              name="lucideCheckCircle"
                              class="h-4 w-4 text-green-400"
                            />
                          }
                          @default {
                            <ng-icon
                              hlmIcon
                              name="lucideActivity"
                              class="text-muted-foreground h-4 w-4"
                            />
                          }
                        }
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-foreground text-sm">
                          <span class="font-medium">{{ getAgentName(log.agent_id) }}</span>
                          {{ log.action.replace('_', ' ') }}
                        </div>
                        @if (
                          log.details?.['repo_name'] ||
                          log.details?.['repo'] ||
                          log.details?.['title']
                        ) {
                          <div class="text-muted-foreground mt-0.5 text-xs">
                            {{
                              log.details?.['repo_name'] ||
                                log.details?.['repo'] ||
                                log.details?.['title']
                            }}
                          </div>
                        }
                      </div>
                      <div class="text-muted-foreground text-xs">
                        {{ formatTimeAgo(log.created_at) }}
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </hlm-card>

          <!-- Pending Tasks -->
          <hlm-card>
            <div class="p-6">
              <h2 class="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
                <ng-icon hlmIcon name="lucideClock" class="h-5 w-5" />
                Task Queue
              </h2>

              @if (pendingTasks().length === 0) {
                <div
                  class="text-muted-foreground rounded-md border border-dashed border-[#21262d] py-8 text-center text-sm"
                >
                  No pending tasks. All clear!
                </div>
              } @else {
                <div class="flex flex-col gap-3">
                  @for (task of pendingTasks().slice(0, 10); track task.id) {
                    <div class="flex items-center gap-3 rounded-md border border-[#21262d] p-3">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-[#21262d]"
                      >
                        @if (task.status === 'running') {
                          <ng-icon
                            hlmIcon
                            name="lucideLoader2"
                            class="h-4 w-4 animate-spin text-blue-400"
                          />
                        } @else if (task.status === 'completed') {
                          <ng-icon
                            hlmIcon
                            name="lucideCheckCircle"
                            class="h-4 w-4 text-green-400"
                          />
                        } @else if (task.status === 'failed') {
                          <ng-icon hlmIcon name="lucideXCircle" class="h-4 w-4 text-red-400" />
                        } @else {
                          <ng-icon hlmIcon name="lucideClock" class="h-4 w-4 text-yellow-400" />
                        }
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-foreground text-sm font-medium">
                          {{ task.type.replace('_', ' ') }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                          {{ getAgentName(task.agent_id) }}
                        </div>
                      </div>
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        [class]="getStatusClass(task.status)"
                      >
                        {{ task.status }}
                      </span>
                    </div>
                  }
                </div>
              }
            </div>
          </hlm-card>
        </div>

        <!-- Agents List -->
        <hlm-card class="mt-6">
          <div class="p-6">
            <h2 class="text-foreground mb-4 flex items-center gap-2 text-lg font-semibold">
              <ng-icon hlmIcon name="lucideBot" class="h-5 w-5" />
              Your Agents
            </h2>

            @if (agents().length === 0) {
              <div
                class="text-muted-foreground rounded-md border border-dashed border-[#21262d] py-8 text-center text-sm"
              >
                No agents yet. Create one in
                <a routerLink="/settings" class="text-foreground underline">Settings</a>.
              </div>
            } @else {
              <div class="overflow-x-auto rounded-md border border-[#21262d]">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-border border-b bg-[#161b22]">
                      <th class="text-muted-foreground px-4 py-2 text-left font-medium">Agent</th>
                      <th class="text-muted-foreground px-4 py-2 text-left font-medium">Status</th>
                      <th class="text-muted-foreground px-4 py-2 text-left font-medium">
                        Tasks This Month
                      </th>
                      <th class="text-muted-foreground px-4 py-2 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (agent of agents(); track agent.id) {
                      <tr class="border-border border-b last:border-b-0 hover:bg-[#161b22]/50">
                        <td class="text-foreground px-4 py-3 font-medium">
                          {{ agent.agent_name }}
                        </td>
                        <td class="px-4 py-3">
                          @if (agent.status === 'active') {
                            <span
                              class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400"
                            >
                              <span class="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                              Active
                            </span>
                          } @else {
                            <span
                              class="inline-flex items-center gap-1.5 rounded-full bg-neutral-500/10 px-2.5 py-0.5 text-xs font-medium text-neutral-400"
                            >
                              <span class="h-1.5 w-1.5 rounded-full bg-neutral-400"></span>
                              Inactive
                            </span>
                          }
                        </td>
                        <td class="text-muted-foreground px-4 py-3 text-xs">
                          {{ getAgentTaskCount(agent.id!) }} tasks
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex items-center justify-end gap-1">
                            <button
                              hlmBtn
                              variant="ghost"
                              size="icon-sm"
                              class="text-muted-foreground hover:text-green-400"
                              title="Run agent"
                              [disabled]="
                                runningAgents().has(agent.id!) || agent.status !== 'active'
                              "
                              (click)="runAgent(agent)"
                            >
                              @if (runningAgents().has(agent.id!)) {
                                <ng-icon
                                  hlmIcon
                                  name="lucideLoader2"
                                  class="h-4 w-4 animate-spin"
                                />
                              } @else {
                                <ng-icon hlmIcon name="lucidePlay" class="h-4 w-4" />
                              }
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </hlm-card>
      </div>
    </div>
  `,
})
export class AgentDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly supabase = inject(SupabaseService);
  private readonly agentService = inject(AgentService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly agents = signal<DbUserAgent[]>([]);
  readonly pendingTasks = signal<DbAgentTask[]>([]);
  readonly activityLogs = signal<DbAgentActivityLog[]>([]);
  readonly runningAgents = signal<Set<string>>(new Set());
  readonly isRunningAll = signal(false);
  readonly completedToday = signal(0);
  readonly failedToday = signal(0);

  constructor() {
    if (this.isBrowser) {
      effect(() => {
        const userId = this.auth.user()?.id;

        if (userId) {
          this.loadData();
        }
      });
    }
  }

  private async loadData(): Promise<void> {
    const userId = this.auth.user()?.id;

    if (!userId) return;

    const agents = await this.supabase.getUserAgents(userId);

    this.agents.set(agents);

    // Load tasks and logs for all agents
    const allTasks: DbAgentTask[] = [];

    const allLogs: DbAgentActivityLog[] = [];

    for (const agent of agents) {
      if (agent.id) {
        const tasks = await this.supabase.getAgentTasks(agent.id);

        allTasks.push(...tasks);

        const logs = await this.supabase.getAgentActivityLogs(agent.id);

        allLogs.push(...logs);
      }
    }

    this.pendingTasks.set(allTasks.filter((t) => t.status === 'pending' || t.status === 'running'));

    // Sort logs by date and take recent ones
    allLogs.sort(
      (a, b) => new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime(),
    );
    this.activityLogs.set(allLogs.slice(0, 20));

    // Count today's stats
    const today = new Date().toISOString().split('T')[0] ?? '';

    this.completedToday.set(
      allTasks.filter((t) => t.status === 'completed' && t.completed_at?.startsWith(today)).length,
    );
    this.failedToday.set(
      allTasks.filter((t) => t.status === 'failed' && t.completed_at?.startsWith(today)).length,
    );
  }

  async runAgent(agent: DbUserAgent): Promise<void> {
    if (!agent.id) return;

    const current = this.runningAgents();

    current.add(agent.id);
    this.runningAgents.set(new Set(current));

    try {
      await this.agentService.executeAgentAction(agent.id);
      await this.loadData();
    } finally {
      const updated = this.runningAgents();

      updated.delete(agent.id);
      this.runningAgents.set(new Set(updated));
    }
  }

  async runAllAgents(): Promise<void> {
    this.isRunningAll.set(true);
    try {
      await this.agentService.runAllAgents();
      await this.loadData();
    } finally {
      this.isRunningAll.set(false);
    }
  }

  getAgentName(agentId: string): string {
    return this.agents().find((a: DbUserAgent) => a.id === agentId)?.agent_name ?? 'Unknown';
  }

  getAgentTaskCount(agentId: string): number {
    return this.activityLogs().filter((l: DbAgentActivityLog) => l.agent_id === agentId).length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400';
      case 'failed':
        return 'bg-red-500/10 text-red-400';
      case 'running':
        return 'bg-blue-500/10 text-blue-400';
      default:
        return 'bg-yellow-500/10 text-yellow-400';
    }
  }

  formatTimeAgo(dateStr?: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);

    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffH = Math.floor(diffMin / 60);

    if (diffH < 24) return `${diffH}h ago`;

    const diffD = Math.floor(diffH / 24);

    return `${diffD}d ago`;
  }
}
