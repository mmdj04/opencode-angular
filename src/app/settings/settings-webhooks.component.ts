import { Component, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { hlmMuted, hlmSmall } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-settings-webhooks',
  imports: [
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
  ],
  template: `
    <hlm-card-header>
      <h3 hlmCardTitle>Webhooks</h3>
      <p hlmCardDescription>Configure webhooks para notificações em tempo real</p>
    </hlm-card-header>
    <div hlmCardContent class="space-y-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="webhook-url">URL do webhook</label>
          <p class="${hlmMuted}">Endpoint para receber notificações</p>
        </div>
        <input
          hlmInput
          id="webhook-url"
          type="url"
          class="w-full sm:w-[280px]"
          placeholder="https://..."
          [value]="webhookUrl()"
          (input)="webhookUrl.set(toValue($event))"
        />
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="webhook-secret">Segredo</label>
          <p class="${hlmMuted}">Chave de assinatura HMAC</p>
        </div>
        <input
          hlmInput
          id="webhook-secret"
          type="password"
          class="w-full sm:w-[280px]"
          [value]="webhookSecret()"
          (input)="webhookSecret.set(toValue($event))"
        />
      </div>

      <hlm-separator />

      <div class="space-y-3">
        <span class="${hlmSmall}">Eventos</span>
        <p class="${hlmMuted}">Selecione os eventos que devem acionar o webhook</p>
        <div class="flex flex-col gap-3">
          @for (event of events; track event.id) {
            <div class="flex items-center gap-2">
              <hlm-checkbox
                [id]="event.id"
                [checked]="selectedEvents().includes(event.id)"
                (checkedChange)="toggleEvent(event.id)"
              ></hlm-checkbox>
              <label hlmLabel [for]="event.id" class="text-sm font-normal">
                {{ event.label }}
              </label>
            </div>
          }
        </div>
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="auto-retry">Retry automático</label>
          <p class="${hlmMuted}">Tentar novamente em caso de falha</p>
        </div>
        <hlm-switch id="auto-retry" [checked]="autoRetry()" (checkedChange)="autoRetry.set($event)">
          <span hlmSwitchThumb></span>
        </hlm-switch>
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="webhook-timeout">Timeout</label>
          <p class="${hlmMuted}">Tempo limite de resposta</p>
        </div>
        <hlm-input-group class="w-full sm:w-[280px]">
          <input
            hlmInputGroupInput
            id="webhook-timeout"
            type="number"
            [value]="webhookTimeout()"
            (input)="webhookTimeout.set(toNumberValue($event))"
          />
          <hlm-input-group-addon align="inline-end">
            <hlm-input-group-text>segundos</hlm-input-group-text>
          </hlm-input-group-addon>
        </hlm-input-group>
      </div>
    </div>
  `,
})
export class SettingsWebhooksComponent {
  readonly webhookUrl = signal('');
  readonly webhookSecret = signal('');
  readonly selectedEvents = signal<string[]>(['deploy', 'push']);
  readonly autoRetry = signal(true);
  readonly webhookTimeout = signal(30);

  readonly events = [
    { id: 'deploy', label: 'Deploy' },
    { id: 'push', label: 'Push' },
    { id: 'pull_request', label: 'Pull Request' },
    { id: 'issue', label: 'Issue' },
  ];

  private readonly initialWebhookUrl = this.webhookUrl();
  private readonly initialWebhookSecret = this.webhookSecret();
  private readonly initialSelectedEvents = this.selectedEvents();
  private readonly initialAutoRetry = this.autoRetry();
  private readonly initialWebhookTimeout = this.webhookTimeout();

  hasChanges(): boolean {
    return (
      this.webhookUrl() !== this.initialWebhookUrl ||
      this.webhookSecret() !== this.initialWebhookSecret ||
      JSON.stringify(this.selectedEvents()) !== JSON.stringify(this.initialSelectedEvents) ||
      this.autoRetry() !== this.initialAutoRetry ||
      this.webhookTimeout() !== this.initialWebhookTimeout
    );
  }

  reset(): void {
    this.webhookUrl.set(this.initialWebhookUrl);
    this.webhookSecret.set(this.initialWebhookSecret);
    this.selectedEvents.set(this.initialSelectedEvents);
    this.autoRetry.set(this.initialAutoRetry);
    this.webhookTimeout.set(this.initialWebhookTimeout);
  }

  save(): void {
    toast.success('Configurações de webhook salvas!');
  }

  toggleEvent(eventId: string): void {
    const current = this.selectedEvents();

    if (current.includes(eventId)) {
      this.selectedEvents.set(current.filter((e) => e !== eventId));
    } else {
      this.selectedEvents.set([...current, eventId]);
    }
  }

  protected toValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected toNumberValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
