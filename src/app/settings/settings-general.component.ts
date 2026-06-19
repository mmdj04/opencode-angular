import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'app-settings-general',
  imports: [
    FormsModule,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmSeparatorImports,
    HlmTextareaImports,
  ],
  template: `
    <hlm-card>
      <hlm-card-header>
        <h3 hlmCardTitle>Projeto</h3>
        <p hlmCardDescription>Configurações gerais do projeto</p>
      </hlm-card-header>
      <div hlmCardContent class="space-y-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <label hlmLabel for="project-name">Nome</label>
            <p class="text-muted-foreground text-sm">Nome do projeto</p>
          </div>
          <input
            hlmInput
            id="project-name"
            class="w-full sm:w-[280px]"
            [value]="name()"
            (input)="name.set(toValue($event))"
          />
        </div>

        <hlm-separator />

        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-0.5 pt-2">
            <label hlmLabel for="project-desc">Descrição</label>
            <p class="text-muted-foreground text-sm">Descrição curta do projeto</p>
          </div>
          <textarea
            hlmTextarea
            id="project-desc"
            class="w-full resize-none sm:w-[280px]"
            rows="3"
            [value]="description()"
            (input)="description.set(toValue($event))"
          ></textarea>
        </div>

        <hlm-separator />

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-0.5">
            <label hlmLabel for="project-region">Região</label>
            <p class="text-muted-foreground text-sm">Região de hospedagem do projeto</p>
          </div>
          <select
            hlmSelect
            id="project-region"
            class="w-full sm:w-[280px]"
            [value]="region()"
            (change)="region.set(toSelectValue($event))"
          >
            <option value="us-east-1">US East (Virginia)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-1">EU West (Irlanda)</option>
            <option value="sa-east-1">South America (São Paulo)</option>
          </select>
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
export class SettingsGeneralComponent {
  readonly name = signal('opencode-angular');
  readonly description = signal('Projeto Angular com Spartan UI e Tailwind CSS');
  readonly region = signal('sa-east-1');

  private readonly initialName = this.name();
  private readonly initialDescription = this.description();
  private readonly initialRegion = this.region();

  hasChanges(): boolean {
    return (
      this.name() !== this.initialName ||
      this.description() !== this.initialDescription ||
      this.region() !== this.initialRegion
    );
  }

  reset(): void {
    this.name.set(this.initialName);
    this.description.set(this.initialDescription);
    this.region.set(this.initialRegion);
  }

  save(): void {
    toast.success('Configurações salvas com sucesso!');
  }

  protected toValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected toSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
