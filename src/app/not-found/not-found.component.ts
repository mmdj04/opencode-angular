import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, HlmButtonImports],
  template: `
    <div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 class="text-4xl font-bold tracking-tight">404</h1>
      <p class="text-muted-foreground text-lg">Página não encontrada</p>
      <a hlmBtn variant="outline" routerLink="/">Voltar para o início</a>
    </div>
  `,
})
export class NotFoundComponent {}
