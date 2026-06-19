import { Component, signal, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-counter',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <h2 class="text-xl font-bold">Signal Counter</h2>
      <p class="text-lg">Count: {{ count() }}</p>
      <p class="text-sm text-surface-500">Double: {{ doubleCount() }}</p>
      <div class="flex gap-2">
        <p-button label="+" (onClick)="increment()" severity="success" />
        <p-button label="-" (onClick)="decrement()" severity="danger" />
        <p-button label="Reset" (onClick)="reset()" severity="secondary" outlined />
      </div>
    </div>
  `,
})
export class CounterComponent {
  count = signal(0);

  doubleCount = computed(() => this.count() * 2);

  increment(): void {
    this.count.update((n) => n + 1);
  }

  decrement(): void {
    this.count.update((n) => n - 1);
  }

  reset(): void {
    this.count.set(0);
  }
}
