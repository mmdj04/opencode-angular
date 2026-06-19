import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCamera, lucideMic, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-search',
  imports: [FormsModule, NgIcon, HlmButtonImports, HlmInputImports],
  providers: [provideIcons({ lucideSearch, lucideMic, lucideCamera })],
  template: `
    <div class="bg-background flex min-h-screen flex-col">
      <!-- Main -->
      <main class="flex flex-1 flex-col items-center justify-center gap-6 pb-20">
        <!-- Logo -->
        <h1 class="text-foreground text-[92px] leading-none font-medium tracking-tight select-none">
          Agentwork
        </h1>

        <!-- Search bar -->
        <div class="relative w-full max-w-[584px] px-4">
          <div
            class="group border-input bg-background focus-within:ring-ring flex h-14 items-center rounded-full border px-4 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 hover:shadow-md"
          >
            <ng-icon hlmIcon name="lucideSearch" class="text-muted-foreground mr-3 shrink-0" />
            <input
              hlmInput
              class="h-full flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              placeholder="Pesquisar no Agentwork ou digitar uma URL"
              [(ngModel)]="query"
              (keyup.enter)="search()"
            />
            <div class="ml-2 flex shrink-0 items-center gap-2">
              <button
                type="button"
                class="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full"
                title="Pesquisa por voz"
              >
                <ng-icon hlmIcon name="lucideMic" />
              </button>
              <button
                type="button"
                class="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-full"
                title="Pesquisa por imagem"
              >
                <ng-icon hlmIcon name="lucideCamera" />
              </button>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            hlmBtn
            variant="outline"
            class="h-10 rounded-full px-4 text-[13px]"
            (click)="search()"
          >
            Agentwork Search
          </button>
          <button
            hlmBtn
            variant="outline"
            class="h-10 rounded-full px-4 text-[13px]"
            (click)="feelingLucky()"
          >
            Estou com sorte
          </button>
        </div>

        <!-- Language -->
        <p class="text-muted-foreground text-[13px]">
          Agentwork disponível em:
          <a href="#" class="ml-1 text-blue-600 hover:underline">English</a>
          <a href="#" class="ml-1 text-blue-600 hover:underline">Español</a>
          <a href="#" class="ml-1 text-blue-600 hover:underline">Français</a>
          <a href="#" class="ml-1 text-blue-600 hover:underline">日本語</a>
          <a href="#" class="ml-1 text-blue-600 hover:underline">Português (Brasil)</a>
        </p>
      </main>

      <!-- Footer -->
      <footer class="bg-secondary text-muted-foreground text-[13px]">
        <div class="border-border border-b px-8 py-3">Brasil</div>
        <div class="flex flex-col gap-3 px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap gap-x-6 gap-y-1">
            <a href="#" class="hover:underline">Sobre</a>
            <a href="#" class="hover:underline">Publicidade</a>
            <a href="#" class="hover:underline">Negócios</a>
          </div>
          <div class="flex flex-wrap gap-x-6 gap-y-1">
            <a href="#" class="hover:underline">Privacidade</a>
            <a href="#" class="hover:underline">Termos</a>
            <a href="/settings" class="hover:underline">Configurações</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class SearchComponent {
  private readonly router = inject(Router);

  protected readonly query = signal('');

  search(): void {
    const q = this.query();

    if (q) {
      this.router.navigate(['/search/results'], { queryParams: { q } });
    }
  }

  feelingLucky(): void {
    this.router.navigate(['/search/results'], { queryParams: { q: 'sorte' } });
  }
}
