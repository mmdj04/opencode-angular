import { Component, inject, afterNextRender, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBot,
  lucideKey,
  lucideLoader2,
  lucideLogOut,
  lucideUser,
  lucideGithub,
  lucidePlus,
  lucidePencil,
  lucideTrash2,
  lucideNewspaper,
  lucideFolderCode,
  lucideCircleCheck,
  lucideCircleX,
  lucideAlertTriangle,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { SettingsService } from './settings.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmLabelImports,
    HlmDialogImports,
    HlmAlertDialogImports,
    HlmBadgeImports,
  ],
  providers: [
    provideIcons({
      lucideBot,
      lucideKey,
      lucideLoader2,
      lucideLogOut,
      lucideUser,
      lucideGithub,
      lucidePlus,
      lucidePencil,
      lucideTrash2,
      lucideNewspaper,
      lucideFolderCode,
      lucideCircleCheck,
      lucideCircleX,
      lucideAlertTriangle,
    }),
  ],
  template: `
    <div class="bg-background flex min-h-screen items-center justify-center p-4">
      <hlm-card class="w-full max-w-[720px]">
        <div class="flex flex-col gap-6 p-8">
          <!-- Header -->
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-foreground text-2xl font-bold tracking-tight">Agentwork Settings</h1>
            <p class="text-muted-foreground text-sm">Manage your AI agents</p>
          </div>

          <!-- Not logged in alert -->
          @if (!auth.isLoggedIn() && auth.authLoaded()) {
            <div class="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div class="flex items-start gap-3">
                <ng-icon hlmIcon name="lucideAlertTriangle" class="text-yellow-500 mt-0.5 shrink-0" />
                <div class="flex flex-col gap-1">
                  <p class="text-foreground text-sm font-medium">Sign in required</p>
                  <p class="text-muted-foreground text-sm">You need to be signed in to manage agents.</p>
                </div>
              </div>
            </div>

            <a routerLink="/sign-in" hlmBtn variant="outline" class="w-full">
              <ng-icon hlmIcon name="lucideGithub" class="mr-2" />
              Sign In with GitHub
            </a>
          }

          <!-- Loading state -->
          @if (!auth.authLoaded()) {
            <div class="flex items-center justify-center py-8">
              <ng-icon hlmIcon name="lucideLoader2" class="text-muted-foreground animate-spin" />
            </div>
          }

          <!-- Logged in content -->
          @if (auth.isLoggedIn()) {
            <!-- User info -->
            <div class="flex items-center gap-3 rounded-md border border-[#21262d] bg-[#161b22] p-3">
              @if (auth.userAvatar()) {
                <img [src]="auth.userAvatar()" class="h-8 w-8 rounded-full" alt="avatar" />
              } @else {
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#30363d]">
                  <ng-icon hlmIcon name="lucideUser" class="text-muted-foreground" />
                </div>
              }
              <div class="min-w-0 flex-1">
                <div class="text-foreground truncate text-[13px] font-medium">{{ auth.userDisplayName() }}</div>
                <div class="text-muted-foreground truncate text-[12px]">{{ auth.userEmail() }}</div>
              </div>
              <button hlmBtn variant="ghost" size="icon-sm" (click)="onSignOut()" title="Sign out">
                <ng-icon hlmIcon name="lucideLogOut" class="text-muted-foreground" />
              </button>
            </div>

            <!-- Create new agent -->
            <div class="flex flex-col gap-4">
              <h2 class="text-foreground flex items-center gap-2 text-lg font-semibold">
                <ng-icon hlmIcon name="lucidePlus" class="h-5 w-5" />
                Create New Agent
              </h2>

              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2">
                  <label hlmLabel for="newAgentName">Agent Name</label>
                  <input
                    hlmInput
                    id="newAgentName"
                    type="text"
                    placeholder="e.g., Research Assistant"
                    [ngModel]="settings.newAgentName()"
                    (ngModelChange)="settings.newAgentName.set($event)"
                    [disabled]="settings.agents().length >= 5"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label hlmLabel for="newAgentApiKey">Gemini API Key (Gemma-4-31b-it)</label>
                  <div hlmInputGroup>
                    <hlm-input-group-addon align="inline-start">
                      <ng-icon hlmIcon name="lucideKey" class="text-muted-foreground" />
                    </hlm-input-group-addon>
                    <input
                      hlmInputGroupInput
                      id="newAgentApiKey"
                      type="password"
                      placeholder="AIza..."
                      [ngModel]="settings.newAgentApiKey()"
                      (ngModelChange)="settings.newAgentApiKey.set($event)"
                      [disabled]="settings.agents().length >= 5"
                    />
                  </div>
                </div>
              </div>

              @if (settings.agents().length >= 5) {
                <p class="text-muted-foreground text-sm">Maximum of 5 agents reached.</p>
              }

              <button
                hlmBtn
                class="w-full"
                [disabled]="settings.isCreatingAgent() || settings.agents().length >= 5"
                (click)="settings.createAgent()"
              >
                @if (settings.isCreatingAgent()) {
                  <ng-icon hlmIcon name="lucideLoader2" class="mr-2 animate-spin" />
                  Creating agent...
                } @else {
                  <ng-icon hlmIcon name="lucidePlus" class="mr-2" />
                  Create Agent
                }
              </button>
            </div>

            <!-- Agents table -->
            <div class="flex flex-col gap-4 border-border border-t pt-6">
              <h2 class="text-foreground flex items-center gap-2 text-lg font-semibold">
                <ng-icon hlmIcon name="lucideBot" class="h-5 w-5" />
                Your Agents
              </h2>

              @if (settings.isLoadingAgents()) {
                <div class="flex items-center justify-center py-8">
                  <ng-icon hlmIcon name="lucideLoader2" class="text-muted-foreground animate-spin" />
                </div>
              } @else if (settings.agents().length === 0) {
                <div class="text-muted-foreground rounded-md border border-dashed border-[#21262d] py-8 text-center text-sm">
                  No agents created yet. Create your first agent above.
                </div>
              } @else {
                <div class="overflow-x-auto rounded-md border border-[#21262d]">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-border border-b bg-[#161b22]">
                        <th class="text-muted-foreground px-4 py-2 text-left font-medium">Agent</th>
                        <th class="text-muted-foreground px-4 py-2 text-left font-medium">Status</th>
                        <th class="text-muted-foreground px-4 py-2 text-left font-medium">API Key</th>
                        <th class="text-muted-foreground px-4 py-2 text-left font-medium">Created</th>
                        <th class="text-muted-foreground px-4 py-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (agent of settings.agents(); track agent.id) {
                        <tr class="border-border border-b last:border-b-0 hover:bg-[#161b22]/50">
                          <td class="text-foreground px-4 py-3 font-medium">{{ agent.agent_name }}</td>
                          <td class="px-4 py-3">
                            @if (agent.status === 'active') {
                              <span class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                                <span class="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                                Active
                              </span>
                            } @else {
                              <span class="inline-flex items-center gap-1.5 rounded-full bg-neutral-500/10 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                                <span class="h-1.5 w-1.5 rounded-full bg-neutral-400"></span>
                                Inactive
                              </span>
                            }
                          </td>
                          <td class="text-muted-foreground px-4 py-3 font-mono text-xs">
                            ****{{ agent.api_key.slice(-4) }}
                          </td>
                          <td class="text-muted-foreground px-4 py-3 text-xs">
                            {{ formatDate(agent.created_at) }}
                          </td>
                          <td class="px-4 py-3">
                            <div class="flex items-center justify-end gap-1">
                              <!-- Generate article -->
                              <button
                                hlmBtn
                                variant="ghost"
                                size="icon-sm"
                                class="text-muted-foreground hover:text-foreground"
                                title="Generate article"
                                [disabled]="settings.generatingArticleFor() === agent.id || agent.status !== 'active'"
                                (click)="settings.openConfirmDialog(agent, 'article')"
                              >
                                @if (settings.generatingArticleFor() === agent.id) {
                                  <ng-icon hlmIcon name="lucideLoader2" class="h-4 w-4 animate-spin" />
                                } @else {
                                  <ng-icon hlmIcon name="lucideNewspaper" class="h-4 w-4" />
                                }
                              </button>

                              <!-- Generate repository -->
                              <button
                                hlmBtn
                                variant="ghost"
                                size="icon-sm"
                                class="text-muted-foreground hover:text-foreground"
                                title="Generate repository"
                                [disabled]="settings.generatingRepoFor() === agent.id || agent.status !== 'active'"
                                (click)="settings.openConfirmDialog(agent, 'repository')"
                              >
                                @if (settings.generatingRepoFor() === agent.id) {
                                  <ng-icon hlmIcon name="lucideLoader2" class="h-4 w-4 animate-spin" />
                                } @else {
                                  <ng-icon hlmIcon name="lucideFolderCode" class="h-4 w-4" />
                                }
                              </button>

                              <!-- Toggle status -->
                              <button
                                hlmBtn
                                variant="ghost"
                                size="icon-sm"
                                class="text-muted-foreground hover:text-foreground"
                                [title]="agent.status === 'active' ? 'Deactivate agent' : 'Activate agent'"
                                (click)="settings.toggleStatus(agent)"
                              >
                                @if (agent.status === 'active') {
                                  <ng-icon hlmIcon name="lucideCircleX" class="h-4 w-4" />
                                } @else {
                                  <ng-icon hlmIcon name="lucideCircleCheck" class="h-4 w-4" />
                                }
                              </button>

                              <!-- Edit -->
                              <button
                                hlmBtn
                                variant="ghost"
                                size="icon-sm"
                                class="text-muted-foreground hover:text-foreground"
                                title="Edit agent"
                                (click)="settings.openEditDialog(agent)"
                              >
                                <ng-icon hlmIcon name="lucidePencil" class="h-4 w-4" />
                              </button>

                              <!-- Delete -->
                              <button
                                hlmBtn
                                variant="ghost"
                                size="icon-sm"
                                class="text-muted-foreground hover:text-red-400"
                                title="Delete agent"
                                (click)="settings.openDeleteDialog(agent)"
                              >
                                <ng-icon hlmIcon name="lucideTrash2" class="h-4 w-4" />
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
          }

          <!-- Back link -->
          <div class="text-center">
            <a routerLink="/" class="text-muted-foreground hover:text-foreground text-sm underline">
              Back to home
            </a>
          </div>
        </div>
      </hlm-card>

      <!-- Edit Agent Dialog -->
      @if (settings.showEditDialog()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="bg-background/80 fixed inset-0 backdrop-blur-sm" (click)="settings.closeEditDialog()"></div>
          <hlm-dialog class="relative z-50 w-full max-w-md">
            <hlm-dialog-content>
              <hlm-dialog-header>
                <h2 hlmDialogTitle>Edit Agent</h2>
                <p hlmDialogDescription>Update the agent name and API key.</p>
              </hlm-dialog-header>

              <div class="flex flex-col gap-4 py-4">
                <div class="flex flex-col gap-2">
                  <label hlmLabel for="editAgentName">Agent Name</label>
                  <input
                    hlmInput
                    id="editAgentName"
                    type="text"
                    [ngModel]="settings.editAgentName()"
                    (ngModelChange)="settings.editAgentName.set($event)"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label hlmLabel for="editAgentApiKey">API Key</label>
                  <div hlmInputGroup>
                    <hlm-input-group-addon align="inline-start">
                      <ng-icon hlmIcon name="lucideKey" class="text-muted-foreground" />
                    </hlm-input-group-addon>
                    <input
                      hlmInputGroupInput
                      id="editAgentApiKey"
                      type="password"
                      placeholder="AIza..."
                      [ngModel]="settings.editAgentApiKey()"
                      (ngModelChange)="settings.editAgentApiKey.set($event)"
                    />
                  </div>
                </div>
              </div>

              <hlm-dialog-footer>
                <button hlmBtn variant="outline" (click)="settings.closeEditDialog()">Cancel</button>
                <button hlmBtn (click)="settings.saveEdit()">Save Changes</button>
              </hlm-dialog-footer>
            </hlm-dialog-content>
          </hlm-dialog>
        </div>
      }

      <!-- Confirm Generation Dialog -->
      @if (settings.showConfirmDialog()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="bg-background/80 fixed inset-0 backdrop-blur-sm" (click)="settings.closeConfirmDialog()"></div>
          <hlm-dialog class="relative z-50 w-full max-w-md">
            <hlm-dialog-content>
              <hlm-dialog-header>
                <h2 hlmDialogTitle>
                  @if (settings.pendingAction() === 'article') {
                    Generate Article?
                  } @else {
                    Generate Repository?
                  }
                </h2>
                <p hlmDialogDescription>
                  @if (settings.pendingAction() === 'article') {
                    Agent "{{ settings.selectedAgent()?.agent_name }}" will generate a news article using its API key. This may take up to 150 seconds.
                  } @else {
                    Agent "{{ settings.selectedAgent()?.agent_name }}" will generate a repository using its API key. This may take up to 150 seconds.
                  }
                </p>
              </hlm-dialog-header>

              <hlm-dialog-footer>
                <button hlmBtn variant="outline" (click)="settings.closeConfirmDialog()">Cancel</button>
                <button hlmBtn (click)="settings.executeConfirmedAction()">
                  @if (settings.pendingAction() === 'article') {
                    <ng-icon hlmIcon name="lucideNewspaper" class="mr-2" />
                    Generate
                  } @else {
                    <ng-icon hlmIcon name="lucideFolderCode" class="mr-2" />
                    Generate
                  }
                </button>
              </hlm-dialog-footer>
            </hlm-dialog-content>
          </hlm-dialog>
        </div>
      }

      <!-- Delete Agent Dialog -->
      @if (settings.showDeleteDialog()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="bg-background/80 fixed inset-0 backdrop-blur-sm" (click)="settings.closeDeleteDialog()"></div>
          <hlm-dialog class="relative z-50 w-full max-w-md">
            <hlm-dialog-content>
              <hlm-dialog-header>
                <h2 hlmDialogTitle>Delete Agent?</h2>
                <p hlmDialogDescription>
                  Agent "{{ settings.selectedAgent()?.agent_name }}" will be permanently deleted. This action cannot be undone.
                </p>
              </hlm-dialog-header>

              <hlm-dialog-footer>
                <button hlmBtn variant="outline" (click)="settings.closeDeleteDialog()">Cancel</button>
                <button hlmBtn variant="destructive" (click)="settings.deleteAgent()">
                  <ng-icon hlmIcon name="lucideTrash2" class="mr-2" />
                  Delete
                </button>
              </hlm-dialog-footer>
            </hlm-dialog-content>
          </hlm-dialog>
        </div>
      }
    </div>
  `,
})
export class SettingsComponent {
  protected readonly settings = inject(SettingsService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser) {
        effect(() => {
          if (this.auth.authLoaded() && !this.auth.isLoggedIn()) {
            this.router.navigate(['/sign-in']);
          }
        });

        effect(() => {
          if (this.auth.isLoggedIn()) {
            this.settings.loadAgents();
          }
        });
      }
    });
  }

  async onSignOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch {
      // Error handled by AuthService
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
