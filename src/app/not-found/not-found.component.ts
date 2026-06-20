import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, NgIcon, HlmButtonImports, HlmCardImports],
  providers: [provideIcons({ lucideSearch })],
  template: `
    <div class="bg-background flex min-h-screen items-center justify-center p-4">
      <hlm-card class="w-full max-w-[400px]">
        <div class="flex flex-col items-center gap-4 p-8 text-center">
          <div class="bg-muted flex size-16 items-center justify-center rounded-full">
            <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground size-8" />
          </div>
          <h1 class="text-foreground text-4xl font-bold tracking-tight">404</h1>
          <p class="text-muted-foreground text-lg">Página não encontrada</p>
          <p class="text-muted-foreground text-sm">
            O link que você segue pode estar quebrado ou a página pode ter sido removida.
          </p>
          <a hlmBtn variant="outline" routerLink="/" class="mt-2">Voltar para o início</a>
        </div>
      </hlm-card>
    </div>
  `,
})
export class NotFoundComponent {}
