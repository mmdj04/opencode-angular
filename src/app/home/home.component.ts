import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-home',
  imports: [HlmCardImports, HlmButtonImports],
  template: `
    <hlm-card class="w-[400px]">
      <hlm-card-header>
        <h3 hlmCardTitle>Spartan UI + Angular 22</h3>
      </hlm-card-header>
      <div hlmCardContent>
        <p class="greeting">Hello, {{ title() }}!</p>
        <p>Count: {{ count() }}</p>
      </div>
      <hlm-card-footer>
        <button hlmBtn variant="outline" (click)="increment()">Increment</button>
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
    .greeting {
      margin-bottom: 1rem;
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
