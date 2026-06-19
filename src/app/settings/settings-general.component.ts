import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'app-settings-general',
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmDropdownMenuImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmTextareaImports,
  ],
  providers: [provideIcons({ lucideCheck })],
  template: `
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
        <button
          hlmBtn
          variant="outline"
          id="project-region"
          class="w-full justify-between sm:w-[280px]"
          [hlmDropdownMenuTrigger]="regionMenu"
        >
          {{ getRegionLabel(region()) }}
        </button>
        <ng-template #regionMenu>
          <hlm-dropdown-menu class="w-56">
            @for (option of regionOptions; track option.value) {
              <button hlmDropdownMenuItem (click)="region.set(option.value)">
                @if (region() === option.value) {
                  <ng-icon name="lucideCheck" class="text-muted-foreground" />
                } @else {
                  <span class="w-4"></span>
                }
                {{ option.label }}
              </button>
            }
          </hlm-dropdown-menu>
        </ng-template>
      </div>
    </div>
  `,
})
export class SettingsGeneralComponent {
  readonly name = signal('opencode-angular');
  readonly description = signal('Projeto Angular com Spartan UI e Tailwind CSS');
  readonly region = signal('sa-east-1');

  readonly regionOptions = [
    { value: 'us-east-1', label: 'US East (Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU West (Irlanda)' },
    { value: 'sa-east-1', label: 'South America (São Paulo)' },
  ];

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
    toast.success('Configurações gerais salvas!');
  }

  getRegionLabel(value: string): string {
    return this.regionOptions.find((o) => o.value === value)?.label ?? value;
  }

  protected toValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
