import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideKey, lucideSettings } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { SettingsService } from './settings.service';

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
  providers: [provideIcons({ lucideSettings, lucideKey })],
  template: `
    <div class="bg-background flex min-h-screen items-center justify-center p-4">
      <hlm-card class="w-full max-w-[420px]">
        <div class="flex flex-col gap-6 p-8">
          <div class="flex flex-col items-center gap-2 text-center">
            <div class="bg-muted flex size-16 items-center justify-center rounded-full">
              <ng-icon hlmIcon name="lucideSettings" class="text-muted-foreground size-8" />
            </div>
            <h1 class="text-foreground text-2xl font-bold tracking-tight">Settings</h1>
            <p class="text-muted-foreground text-sm">Configure your AI agent</p>
          </div>

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

          <button hlmBtn class="w-full" (click)="settings.save()">Save Settings</button>

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
}
