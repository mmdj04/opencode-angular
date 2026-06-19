import { Component, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { hlmMuted } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-settings-advanced',
  imports: [
    HlmButtonImports,
    HlmCardImports,
    HlmInputGroupImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
  ],
  template: `
    <hlm-card-header>
      <h3 hlmCardTitle>Avançado</h3>
      <p hlmCardDescription>Configurações avançadas do sistema</p>
    </hlm-card-header>
    <div hlmCardContent class="space-y-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="debug-mode">Modo de depuração global</label>
          <p class="${hlmMuted}">Habilitar logs detalhados em todo o sistema</p>
        </div>
        <hlm-switch id="debug-mode" [checked]="debugMode()" (checkedChange)="debugMode.set($event)">
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="cache-ttl">Cache TTL</label>
          <p class="${hlmMuted}">Tempo de vida do cache</p>
        </div>
        <hlm-input-group class="w-full sm:w-[280px]">
          <input
            hlmInputGroupInput
            id="cache-ttl"
            type="number"
            [value]="cacheTtl()"
            (input)="cacheTtl.set(toNumberValue($event))"
          />
          <hlm-input-group-addon align="inline-end">
            <hlm-input-group-text>segundos</hlm-input-group-text>
          </hlm-input-group-addon>
        </hlm-input-group>
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="gzip">Compressão gzip</label>
          <p class="${hlmMuted}">Comprimir respostas HTTP</p>
        </div>
        <hlm-switch id="gzip" [checked]="gzipEnabled()" (checkedChange)="gzipEnabled.set($event)">
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="security-headers">Headers de segurança</label>
          <p class="${hlmMuted}">Adicionar headers HTTP de segurança</p>
        </div>
        <hlm-switch
          id="security-headers"
          [checked]="securityHeaders()"
          (checkedChange)="securityHeaders.set($event)"
        >
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="audit-log">Log de auditoria</label>
          <p class="${hlmMuted}">Registrar ações dos usuários</p>
        </div>
        <hlm-switch id="audit-log" [checked]="auditLog()" (checkedChange)="auditLog.set($event)">
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>
    </div>
  `,
})
export class SettingsAdvancedComponent {
  readonly debugMode = signal(false);
  readonly cacheTtl = signal(3600);
  readonly gzipEnabled = signal(true);
  readonly securityHeaders = signal(true);
  readonly auditLog = signal(false);

  private readonly initialDebugMode = this.debugMode();
  private readonly initialCacheTtl = this.cacheTtl();
  private readonly initialGzipEnabled = this.gzipEnabled();
  private readonly initialSecurityHeaders = this.securityHeaders();
  private readonly initialAuditLog = this.auditLog();

  hasChanges(): boolean {
    return (
      this.debugMode() !== this.initialDebugMode ||
      this.cacheTtl() !== this.initialCacheTtl ||
      this.gzipEnabled() !== this.initialGzipEnabled ||
      this.securityHeaders() !== this.initialSecurityHeaders ||
      this.auditLog() !== this.initialAuditLog
    );
  }

  reset(): void {
    this.debugMode.set(this.initialDebugMode);
    this.cacheTtl.set(this.initialCacheTtl);
    this.gzipEnabled.set(this.initialGzipEnabled);
    this.securityHeaders.set(this.initialSecurityHeaders);
    this.auditLog.set(this.initialAuditLog);
  }

  save(): void {
    toast.success('Configurações avançadas salvas!');
  }

  protected toNumberValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
