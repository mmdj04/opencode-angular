import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

@Component({
  selector: 'app-settings-api',
  imports: [
    FormsModule,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
  ],
  template: `
    <hlm-card>
      <hlm-card-header>
        <h3 hlmCardTitle>API</h3>
        <p hlmCardDescription>Configurações de API e endpoints</p>
      </hlm-card-header>
      <div hlmCardContent class="space-y-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <label hlmLabel for="api-endpoint">Endpoint</label>
            <p class="text-muted-foreground text-sm">URL base da API</p>
          </div>
          <input
            hlmInput
            id="api-endpoint"
            class="w-full sm:w-[280px]"
            [value]="endpoint()"
            (input)="endpoint.set(toValue($event))"
          />
        </div>

        <hlm-separator />

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <label hlmLabel for="api-key">Chave API</label>
            <p class="text-muted-foreground text-sm">Chave de acesso à API</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              hlmInput
              id="api-key"
              class="w-full font-mono text-sm sm:w-[280px]"
              [value]="apiKey()"
              readonly
            />
            <hlm-badge variant="secondary">Ativo</hlm-badge>
          </div>
        </div>

        <hlm-separator />

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <label hlmLabel for="api-debug">Modo Debug</label>
            <p class="text-muted-foreground text-sm">Habilitar logs detalhados da API</p>
          </div>
          <hlm-switch
            id="api-debug"
            [checked]="debugMode()"
            (checkedChange)="debugMode.set($event)"
          >
            <span hlmSwitchThumb></span>
          </hlm-switch>
        </div>

        <hlm-separator />

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <label hlmLabel for="api-rate">Rate Limit</label>
            <p class="text-muted-foreground text-sm">Limite de requisições por minuto</p>
          </div>
          <input
            hlmInput
            id="api-rate"
            type="number"
            class="w-full sm:w-[280px]"
            [value]="rateLimit()"
            (input)="rateLimit.set(toNumberValue($event))"
          />
        </div>
      </div>
      <hlm-card-footer class="justify-end gap-2 pt-(--card-spacing)">
        @if (hasChanges()) {
          <button hlmBtn variant="outline" (click)="reset()">Cancelar</button>
        }
        <button hlmBtn [disabled]="!hasChanges()" (click)="save()">Salvar</button>
      </hlm-card-footer>
    </hlm-card>
  `,
})
export class SettingsApiComponent {
  readonly endpoint = signal('https://api.opencode-angular.dev');
  readonly apiKey = signal('sk_live_51H3x4mpl3_4nd_53cur3_k3y_1234567890');
  readonly debugMode = signal(false);
  readonly rateLimit = signal(1000);

  private readonly initialEndpoint = this.endpoint();
  private readonly initialDebugMode = this.debugMode();
  private readonly initialRateLimit = this.rateLimit();

  hasChanges(): boolean {
    return (
      this.endpoint() !== this.initialEndpoint ||
      this.debugMode() !== this.initialDebugMode ||
      this.rateLimit() !== this.initialRateLimit
    );
  }

  reset(): void {
    this.endpoint.set(this.initialEndpoint);
    this.debugMode.set(this.initialDebugMode);
    this.rateLimit.set(this.initialRateLimit);
  }

  save(): void {
    toast.success('Configurações de API salvas!');
  }

  protected toValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected toNumberValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
