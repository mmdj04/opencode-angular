import { Component, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { hlmMuted } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-settings-security',
  imports: [
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
    HlmTextareaImports,
  ],
  template: `
    <hlm-card-header>
      <h3 hlmCardTitle>Segurança</h3>
      <p hlmCardDescription>Configurações de segurança e autenticação</p>
    </hlm-card-header>
    <div hlmCardContent class="space-y-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="two-factor">Autenticação em 2 fatores</label>
          <p class="${hlmMuted}">Adicionar uma camada extra de segurança</p>
        </div>
        <hlm-switch id="two-factor" [checked]="twoFactor()" (checkedChange)="twoFactor.set($event)">
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator class="-mx-(--card-spacing)" />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="session-timeout">Timeout de sessão</label>
          <p class="${hlmMuted}">Tempo de inatividade antes do logout</p>
        </div>
        <hlm-input-group class="w-full sm:w-[280px]">
          <input
            hlmInputGroupInput
            id="session-timeout"
            type="number"
            [value]="sessionTimeout()"
            (input)="sessionTimeout.set(toNumberValue($event))"
          />
          <hlm-input-group-addon align="inline-end">
            <hlm-input-group-text>minutos</hlm-input-group-text>
          </hlm-input-group-addon>
        </hlm-input-group>
      </div>

      <hlm-separator class="-mx-(--card-spacing)" />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="key-rotation">Rotação automática de API Key</label>
          <p class="${hlmMuted}">Rotacionar chaves a cada 90 dias</p>
        </div>
        <hlm-switch
          id="key-rotation"
          [checked]="keyRotation()"
          (checkedChange)="keyRotation.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator class="-mx-(--card-spacing)" />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-0.5 pt-2">
          <label hlmLabel for="ip-allowlist">Allowlist de IPs</label>
          <p class="${hlmMuted}">Um IP por linha</p>
        </div>
        <textarea
          hlmTextarea
          id="ip-allowlist"
          class="w-full resize-none sm:w-[280px]"
          rows="3"
          [value]="ipAllowlist()"
          (input)="ipAllowlist.set(toValue($event))"
        ></textarea>
      </div>

      <hlm-separator class="-mx-(--card-spacing)" />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="security-webhook">Webhook de segurança</label>
          <p class="${hlmMuted}">URL para notificações de segurança</p>
        </div>
        <input
          hlmInput
          id="security-webhook"
          type="url"
          class="w-full sm:w-[280px]"
          placeholder="https://..."
          [value]="securityWebhook()"
          (input)="securityWebhook.set(toValue($event))"
        />
      </div>
    </div>
  `,
})
export class SettingsSecurityComponent {
  readonly twoFactor = signal(false);
  readonly sessionTimeout = signal(30);
  readonly keyRotation = signal(true);
  readonly ipAllowlist = signal('');
  readonly securityWebhook = signal('');

  private readonly initialTwoFactor = this.twoFactor();
  private readonly initialSessionTimeout = this.sessionTimeout();
  private readonly initialKeyRotation = this.keyRotation();
  private readonly initialIpAllowlist = this.ipAllowlist();
  private readonly initialSecurityWebhook = this.securityWebhook();

  hasChanges(): boolean {
    return (
      this.twoFactor() !== this.initialTwoFactor ||
      this.sessionTimeout() !== this.initialSessionTimeout ||
      this.keyRotation() !== this.initialKeyRotation ||
      this.ipAllowlist() !== this.initialIpAllowlist ||
      this.securityWebhook() !== this.initialSecurityWebhook
    );
  }

  reset(): void {
    this.twoFactor.set(this.initialTwoFactor);
    this.sessionTimeout.set(this.initialSessionTimeout);
    this.keyRotation.set(this.initialKeyRotation);
    this.ipAllowlist.set(this.initialIpAllowlist);
    this.securityWebhook.set(this.initialSecurityWebhook);
  }

  save(): void {
    toast.success('Configurações de segurança salvas!');
  }

  protected toValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected toNumberValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
