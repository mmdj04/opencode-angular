import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { hlmMuted } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-settings-notifications',
  imports: [
    FormsModule,
    HlmButtonImports,
    HlmCardImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
  ],
  template: `
    <hlm-card-header>
      <h3 hlmCardTitle>Notificações</h3>
      <p hlmCardDescription>Configure como você deseja receber notificações</p>
    </hlm-card-header>
    <div hlmCardContent class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <label hlmLabel for="email-notifications">Email</label>
          <p class="${hlmMuted}">Receber notificações por email</p>
        </div>
        <hlm-switch
          id="email-notifications"
          [checked]="emailEnabled()"
          (checkedChange)="emailEnabled.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <label hlmLabel for="push-notifications">Push</label>
          <p class="${hlmMuted}">Receber notificações push no navegador</p>
        </div>
        <hlm-switch
          id="push-notifications"
          [checked]="pushEnabled()"
          (checkedChange)="pushEnabled.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <label hlmLabel for="security-alerts">Alertas de Segurança</label>
          <p class="${hlmMuted}">Notificar sobre atividades suspeitas</p>
        </div>
        <hlm-switch
          id="security-alerts"
          [checked]="securityAlerts()"
          (checkedChange)="securityAlerts.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <label hlmLabel for="marketing">Novidades</label>
          <p class="${hlmMuted}">Receber atualizações sobre novos recursos</p>
        </div>
        <hlm-switch
          id="marketing"
          [checked]="marketingEnabled()"
          (checkedChange)="marketingEnabled.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <label hlmLabel for="weekly-report">Relatório Semanal</label>
          <p class="${hlmMuted}">Receber resumo semanal de atividades</p>
        </div>
        <hlm-switch
          id="weekly-report"
          [checked]="weeklyReport()"
          (checkedChange)="weeklyReport.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>
    </div>
  `,
})
export class SettingsNotificationsComponent {
  readonly emailEnabled = signal(true);
  readonly pushEnabled = signal(false);
  readonly securityAlerts = signal(true);
  readonly marketingEnabled = signal(false);
  readonly weeklyReport = signal(true);

  private readonly initialEmail = this.emailEnabled();
  private readonly initialPush = this.pushEnabled();
  private readonly initialSecurity = this.securityAlerts();
  private readonly initialMarketing = this.marketingEnabled();
  private readonly initialWeekly = this.weeklyReport();

  hasChanges(): boolean {
    return (
      this.emailEnabled() !== this.initialEmail ||
      this.pushEnabled() !== this.initialPush ||
      this.securityAlerts() !== this.initialSecurity ||
      this.marketingEnabled() !== this.initialMarketing ||
      this.weeklyReport() !== this.initialWeekly
    );
  }

  reset(): void {
    this.emailEnabled.set(this.initialEmail);
    this.pushEnabled.set(this.initialPush);
    this.securityAlerts.set(this.initialSecurity);
    this.marketingEnabled.set(this.initialMarketing);
    this.weeklyReport.set(this.initialWeekly);
  }

  save(): void {
    toast.success('Notificações atualizadas!');
  }
}
