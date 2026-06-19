import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HlmCardImports, HlmButtonImports],
  template: `
    <hlm-card class="w-[400px]">
      <hlm-card-header>
        <h3 hlmCardTitle>Spartan UI + Angular 22</h3>
      </hlm-card-header>
      <div hlmCardContent class="space-y-4">
        <p>Hello, {{ title() }}!</p>
        <p>Count: {{ count() }}</p>
      </div>
      <hlm-card-footer class="gap-2">
        <button hlmBtn variant="outline" (click)="increment()">Increment</button>
        <a hlmBtn variant="ghost" routerLink="/search">Pesquisa</a>
        <a hlmBtn routerLink="/settings">Configurações</a>
      </hlm-card-footer>
    </hlm-card>
  `,
  styles: `
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
  `,
})
export class HomeComponent {
  protected readonly title = signal('opencode-angular');
  protected count = signal(0);

  increment(): void {
    this.count.update((c) => c + 1);
  }
}
