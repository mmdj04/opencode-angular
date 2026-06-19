import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { hlmMuted } from '@spartan-ng/helm/typography';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-settings-appearance',
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmDropdownMenuImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
  ],
  providers: [provideIcons({ lucideCheck })],
  template: `
    <hlm-card-header>
      <h3 hlmCardTitle>Aparência</h3>
      <p hlmCardDescription>Personalize a aparência do projeto</p>
    </hlm-card-header>
    <div hlmCardContent class="space-y-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="dark-mode">Modo Escuro</label>
          <p class="${hlmMuted}">Alternar entre tema claro e escuro</p>
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

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="language">Idioma</label>
          <p class="${hlmMuted}">Idioma da interface</p>
        </div>
        <button
          hlmBtn
          variant="outline"
          id="language"
          class="w-full justify-between sm:w-[280px]"
          [hlmDropdownMenuTrigger]="languageMenu"
        >
          {{ getLanguageLabel(language()) }}
        </button>
        <ng-template #languageMenu>
          <hlm-dropdown-menu class="w-56">
            @for (option of languageOptions; track option.value) {
              <button hlmDropdownMenuItem (click)="language.set(option.value)">
                @if (language() === option.value) {
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

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="font-size">Tamanho da Fonte</label>
          <p class="${hlmMuted}">Tamanho base da fonte da interface</p>
        </div>
        <button
          hlmBtn
          variant="outline"
          id="font-size"
          class="w-full justify-between sm:w-[280px]"
          [hlmDropdownMenuTrigger]="fontSizeMenu"
        >
          {{ getFontSizeLabel(fontSize()) }}
        </button>
        <ng-template #fontSizeMenu>
          <hlm-dropdown-menu class="w-56">
            @for (option of fontSizeOptions; track option.value) {
              <button hlmDropdownMenuItem (click)="fontSize.set(option.value)">
                @if (fontSize() === option.value) {
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

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="sidebar-collapsed">Sidebar Compacta</label>
          <p class="${hlmMuted}">Iniciar com sidebar recolhida</p>
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
  `,
})
export class SettingsAppearanceComponent {
  readonly themeService = inject(ThemeService);

  readonly language = signal('pt-BR');
  readonly fontSize = signal('medium');
  readonly sidebarCollapsed = signal(false);

  readonly languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ];

  readonly fontSizeOptions = [
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' },
  ];

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

  getLanguageLabel(value: string): string {
    return this.languageOptions.find((o) => o.value === value)?.label ?? value;
  }

  getFontSizeLabel(value: string): string {
    return this.fontSizeOptions.find((o) => o.value === value)?.label ?? value;
  }
}
