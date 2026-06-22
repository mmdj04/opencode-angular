import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCode, lucideKey, lucideLoader2, lucideLogOut, lucideUser } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
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
  ],
  providers: [provideIcons({ lucideKey, lucideLoader2, lucideCode, lucideLogOut, lucideUser })],
  template: `
    <div class="bg-background flex min-h-screen items-center justify-center p-4">
      <hlm-card class="w-full max-w-[420px]">
        <div class="flex flex-col gap-6 p-8">
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-foreground text-2xl font-bold tracking-tight">Settings</h1>
            <p class="text-muted-foreground text-sm">Configure your AI agent</p>
          </div>

          <!-- Logged in user info -->
          @if (auth.isLoggedIn()) {
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
              <button
                hlmBtn
                variant="ghost"
                size="icon-sm"
                (click)="onSignOut()"
                title="Sign out"
              >
                <ng-icon hlmIcon name="lucideLogOut" class="text-muted-foreground" />
              </button>
            </div>
          } @else {
            <div class="flex gap-3">
              <a routerLink="/sign-in" hlmBtn variant="outline" class="w-full">Sign In</a>
              <a routerLink="/sign-up" hlmBtn class="w-full">Sign Up</a>
            </div>
          }

          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label hlmLabel for="agentName">Agent Name</label>
              <input
                hlmInput
                id="agentName"
                type="text"
                placeholder="e.g., Research Assistant"
                [ngModel]="settings.agentName()"
                (ngModelChange)="settings.agentName.set($event)"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label hlmLabel for="apiKey">Gemini API Key (Gemma-4-31b-it)</label>
              <div hlmInputGroup>
                <hlm-input-group-addon align="inline-start">
                  <ng-icon hlmIcon name="lucideKey" class="text-muted-foreground" />
                </hlm-input-group-addon>
                <input
                  hlmInputGroupInput
                  id="apiKey"
                  type="password"
                  placeholder="AIza..."
                  [ngModel]="settings.apiKey()"
                  (ngModelChange)="settings.apiKey.set($event)"
                />
              </div>
            </div>
          </div>

          <button hlmBtn class="w-full" [disabled]="settings.isGenerating()" (click)="settings.save()">
            @if (settings.isGenerating()) {
              <ng-icon hlmIcon name="lucideLoader2" class="mr-2 animate-spin" />
              Generating articles...
            } @else {
              Save Settings
            }
          </button>

          <!-- Code Generator -->
          <div class="border-border border-t pt-6">
            <div class="mb-4 flex flex-col gap-1">
              <h2 class="text-foreground flex items-center gap-2 text-lg font-semibold">
                <ng-icon hlmIcon name="lucideCode" class="h-5 w-5" />
                Code Generator
              </h2>
              <p class="text-muted-foreground text-sm">Generate a simple website with Gemma</p>
            </div>

            <button
              hlmBtn
              variant="outline"
              class="w-full"
              [disabled]="settings.isCodeGenerating()"
              (click)="settings.generateCode()"
            >
              @if (settings.isCodeGenerating()) {
                <ng-icon hlmIcon name="lucideLoader2" class="mr-2 animate-spin" />
                Generating website...
              } @else {
                <ng-icon hlmIcon name="lucideCode" class="mr-2" />
                Generate Website
              }
            </button>
          </div>

          <div class="text-center">
            <a routerLink="/" class="text-muted-foreground hover:text-foreground text-sm underline">
              Back to home
            </a>
          </div>
        </div>
      </hlm-card>
    </div>
  `,
})
export class SettingsComponent {
  protected readonly settings = inject(SettingsService);
  protected readonly auth = inject(AuthService);

  async onSignOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch {
      // Error handled by AuthService
    }
  }
}
