import { Component, ViewChild } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { SettingsAdvancedComponent } from './settings-advanced.component';
import { SettingsApiComponent } from './settings-api.component';
import { SettingsAppearanceComponent } from './settings-appearance.component';
import { SettingsGeneralComponent } from './settings-general.component';
import { SettingsNotificationsComponent } from './settings-notifications.component';
import { SettingsSecurityComponent } from './settings-security.component';
import { SettingsTeamComponent } from './settings-team.component';
import { SettingsWebhooksComponent } from './settings-webhooks.component';

@Component({
  selector: 'app-settings',
  imports: [
    HlmButtonImports,
    HlmCardImports,
    HlmSeparatorImports,
    SettingsGeneralComponent,
    SettingsApiComponent,
    SettingsAppearanceComponent,
    SettingsNotificationsComponent,
    SettingsSecurityComponent,
    SettingsTeamComponent,
    SettingsWebhooksComponent,
    SettingsAdvancedComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Configurações</h1>
        <p class="text-muted-foreground">Gerencie as configurações do seu projeto</p>
      </div>

      <hlm-card>
        <app-settings-general #general />
        <hlm-separator />
        <app-settings-api #api />
        <hlm-separator />
        <app-settings-appearance #appearance />
        <hlm-separator />
        <app-settings-notifications #notifications />
        <hlm-separator />
        <app-settings-security #security />
        <hlm-separator />
        <app-settings-team #team />
        <hlm-separator />
        <app-settings-webhooks #webhooks />
        <hlm-separator />
        <app-settings-advanced #advanced />
        <hlm-card-footer class="justify-end gap-2 pt-(--card-spacing)">
          @if (hasChanges()) {
            <button hlmBtn variant="outline" (click)="reset()">Cancelar</button>
          }
          <button hlmBtn [disabled]="!hasChanges()" (click)="save()">Salvar</button>
        </hlm-card-footer>
      </hlm-card>
    </div>
  `,
})
export class SettingsComponent {
  @ViewChild('general') private general!: SettingsGeneralComponent;
  @ViewChild('api') private api!: SettingsApiComponent;
  @ViewChild('appearance') private appearance!: SettingsAppearanceComponent;
  @ViewChild('notifications') private notifications!: SettingsNotificationsComponent;
  @ViewChild('security') private security!: SettingsSecurityComponent;
  @ViewChild('team') private team!: SettingsTeamComponent;
  @ViewChild('webhooks') private webhooks!: SettingsWebhooksComponent;
  @ViewChild('advanced') private advanced!: SettingsAdvancedComponent;

  private get sections(): {
    hasChanges(): boolean;
    reset(): void;
    save(): void;
  }[] {
    return [
      this.general,
      this.api,
      this.appearance,
      this.notifications,
      this.security,
      this.team,
      this.webhooks,
      this.advanced,
    ].filter(Boolean);
  }

  hasChanges(): boolean {
    return this.sections.some((s) => s.hasChanges());
  }

  reset(): void {
    this.sections.forEach((s) => s.reset());
  }

  save(): void {
    this.sections.forEach((s) => s.save());
    toast.success('Todas as configurações salvas!');
  }
}
