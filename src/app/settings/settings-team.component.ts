import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { hlmMuted, hlmSmall } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-settings-team',
  imports: [
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmDropdownMenuImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
  ],
  providers: [provideIcons({ lucideCheck })],
  template: `
    <hlm-card-header>
      <h3 hlmCardTitle>Equipe</h3>
      <p hlmCardDescription>Gerencie membros e permissões da equipe</p>
    </hlm-card-header>
    <div hlmCardContent class="space-y-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="team-name">Nome da equipe</label>
          <p class="${hlmMuted}">Nome exibido na interface</p>
        </div>
        <input
          hlmInput
          id="team-name"
          class="w-full sm:w-[280px]"
          [value]="teamName()"
          (input)="teamName.set(toValue($event))"
        />
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="member-limit">Limite de membros</label>
          <p class="${hlmMuted}">Número máximo de membros</p>
        </div>
        <input
          hlmInput
          id="member-limit"
          type="number"
          class="w-full sm:w-[280px]"
          [value]="memberLimit()"
          (input)="memberLimit.set(toNumberValue($event))"
        />
      </div>

      <hlm-separator />

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <label hlmLabel for="default-role">Papel padrão</label>
          <p class="${hlmMuted}">Papel atribuído a novos membros</p>
        </div>
        <button
          hlmBtn
          variant="outline"
          id="default-role"
          class="w-full justify-between sm:w-[280px]"
          [hlmDropdownMenuTrigger]="roleMenu"
        >
          {{ getDefaultRoleLabel(defaultRole()) }}
        </button>
        <ng-template #roleMenu>
          <hlm-dropdown-menu class="w-56">
            @for (option of roleOptions; track option.value) {
              <button hlmDropdownMenuItem (click)="defaultRole.set(option.value)">
                @if (defaultRole() === option.value) {
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
          <label hlmLabel for="invite-email">Convidar por email</label>
          <p class="${hlmMuted}">Enviar convite para novo membro</p>
        </div>
        <div class="flex items-center gap-2">
          <input
            hlmInput
            id="invite-email"
            type="email"
            class="w-full sm:w-[280px]"
            placeholder="email@exemplo.com"
            [value]="inviteEmail()"
            (input)="inviteEmail.set(toValue($event))"
          />
          <button hlmBtn variant="secondary" [disabled]="!inviteEmail()">Convidar</button>
        </div>
      </div>

      <hlm-separator />

      <div class="space-y-3">
        <span class="${hlmSmall}">Membros atuais</span>
        @for (member of members(); track member.name) {
          <div class="flex items-center justify-between rounded-lg border p-3">
            <div class="flex items-center gap-3">
              <div
                class="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
              >
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-medium">{{ member.name }}</p>
                <p class="text-muted-foreground text-xs">{{ member.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <hlm-badge variant="secondary">{{ member.role }}</hlm-badge>
              <button hlmBtn variant="ghost" size="sm">Remover</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class SettingsTeamComponent {
  readonly teamName = signal('Equipe Opencode');
  readonly memberLimit = signal(10);
  readonly defaultRole = signal('editor');
  readonly inviteEmail = signal('');
  readonly members = signal([
    { name: 'Alice Silva', email: 'alice@exemplo.com', role: 'Admin' },
    { name: 'Bob Santos', email: 'bob@exemplo.com', role: 'Editor' },
    { name: 'Carol Oliveira', email: 'carol@exemplo.com', role: 'Visualizador' },
  ]);

  readonly roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' },
  ];

  private readonly initialTeamName = this.teamName();
  private readonly initialMemberLimit = this.memberLimit();
  private readonly initialDefaultRole = this.defaultRole();

  hasChanges(): boolean {
    return (
      this.teamName() !== this.initialTeamName ||
      this.memberLimit() !== this.initialMemberLimit ||
      this.defaultRole() !== this.initialDefaultRole
    );
  }

  reset(): void {
    this.teamName.set(this.initialTeamName);
    this.memberLimit.set(this.initialMemberLimit);
    this.defaultRole.set(this.initialDefaultRole);
  }

  save(): void {
    toast.success('Configurações da equipe salvas!');
  }

  getDefaultRoleLabel(value: string): string {
    return this.roleOptions.find((o) => o.value === value)?.label ?? value;
  }

  protected toValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected toNumberValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }
}
