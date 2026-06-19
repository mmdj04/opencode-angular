import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-settings-appearance',
  imports: [
    FormsModule,
    HlmButtonImports,
    HlmCardImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmSeparatorImports,
    HlmSwitchImports,
  ],
  template: `
    <hlm-card>
      <hlm-card-header>
        <h3 hlmCardTitle>Aparência</h3>
        <p hlmCardDescription>Personalize a aparência do projeto</p>
      </hlm-card-header>
      <div hlmCardContent class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <label hlmLabel for="dark-mode">Modo Escuro</label>
            <p class="text-muted-foreground text-sm">Alternar entre tema claro e escuro</p>
          </div>
          <hlm-switch
            id="dark-mode"
            [checked]="themeService.isDark()"
            (checkedChange)="toggleTheme()"
          >
            <span hlmSwitchThumb></span>
          </hlm-switch>
        </div>

        <hlm-separator />

        <div class="flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <label hlmLabel for="language">Idioma</label>
            <p class="text-muted-foreground text-sm">Idioma da interface</p>
          </div>
          <select
            hlmSelect
            id="language"
            class="w-[280px]"
            [value]="language()"
            (change)="language.set(toSelectValue($event))"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <hlm-separator />

        <div class="flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <label hlmLabel for="font-size">Tamanho da Fonte</label>
            <p class="text-muted-foreground text-sm">Tamanho base da fonte da interface</p>
          </div>
          <select
            hlmSelect
            id="font-size"
            class="w-[280px]"
            [value]="fontSize()"
            (change)="fontSize.set(toSelectValue($event))"
          >
            <option value="small">Pequeno</option>
            <option value="medium">Médio</option>
            <option value="large">Grande</option>
          </select>
        </div>

        <hlm-separator />

        <div class="flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <label hlmLabel for="sidebar-collapsed">Sidebar Compacta</label>
            <p class="text-muted-foreground text-sm">Iniciar com sidebar recolhida</p>
          </div>
          <hlm-switch
            id="sidebar-collapsed"
            [checked]="sidebarCollapsed()"
            (checkedChange)="sidebarCollapsed.set($event)"
          >
            <span hlmSwitchThumb></span>
          </hlm-switch>
        </div>
      </div>
      <div hlm-card-footer class="justify-end gap-2">
        @if (hasChanges()) {
          <button hlmBtn variant="outline" (click)="reset()">Cancelar</button>
        }
        <button hlmBtn [disabled]="!hasChanges()" (click)="save()">Salvar</button>
      </div>
    </hlm-card>
  `,
})
export class SettingsAppearanceComponent {
  readonly themeService = inject(ThemeService);

  readonly language = signal('pt-BR');
  readonly fontSize = signal('medium');
  readonly sidebarCollapsed = signal(false);

  private readonly initialLanguage = this.language();
  private readonly initialFontSize = this.fontSize();
  private readonly initialSidebarCollapsed = this.sidebarCollapsed();

  hasChanges(): boolean {
    return (
      this.language() !== this.initialLanguage ||
      this.fontSize() !== this.initialFontSize ||
      this.sidebarCollapsed() !== this.initialSidebarCollapsed
    );
  }

  reset(): void {
    this.language.set(this.initialLanguage);
    this.fontSize.set(this.initialFontSize);
    this.sidebarCollapsed.set(this.initialSidebarCollapsed);
  }

  save(): void {
    toast.success('Aparência atualizada!');
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  protected toSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
