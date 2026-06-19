import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule],
  template: `
    <p-card header="PrimeNG + Angular 22">
      <p class="greeting">Hello, {{ title() }}!</p>
      <p>Count: {{ count() }}</p>
      <p-button label="Increment" (onClick)="increment()" severity="success" />
    </p-card>
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
