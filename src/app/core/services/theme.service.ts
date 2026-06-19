import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);

  toggle(): void {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark', this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }

  init(): void {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('theme');

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDark.set(saved ? saved === 'dark' : prefersDark);
    document.documentElement.classList.toggle('dark', this.isDark());
  }
}
