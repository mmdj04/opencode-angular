import { Component } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { SettingsApiComponent } from './settings-api.component';
import { SettingsAppearanceComponent } from './settings-appearance.component';
import { SettingsGeneralComponent } from './settings-general.component';
import { SettingsNotificationsComponent } from './settings-notifications.component';

@Component({
  selector: 'app-settings',
  imports: [
    HlmTabsImports,
    SettingsGeneralComponent,
    SettingsApiComponent,
    SettingsAppearanceComponent,
    SettingsNotificationsComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl space-y-8 py-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Configurações</h1>
        <p class="text-muted-foreground">Gerencie as configurações do seu projeto</p>
      </div>

      <hlm-tabs tab="general">
        <div hlmTabsList>
          <button hlmTabsTrigger="general">Geral</button>
          <button hlmTabsTrigger="api">API</button>
          <button hlmTabsTrigger="appearance">Aparência</button>
          <button hlmTabsTrigger="notifications">Notificações</button>
        </div>

        <div hlmTabsContent="general">
          <app-settings-general />
        </div>

        <div hlmTabsContent="api">
          <app-settings-api />
        </div>

        <div hlmTabsContent="appearance">
          <app-settings-appearance />
        </div>

        <div hlmTabsContent="notifications">
          <app-settings-notifications />
        </div>
      </hlm-tabs>
    </div>
  `,
})
export class SettingsComponent {}
