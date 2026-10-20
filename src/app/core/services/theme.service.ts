import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');
  isDark = computed(() => this.theme() === 'dark'); 

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      this.theme.set(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme.set('dark');
    }
    this.apply();
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
    localStorage.setItem('theme', this.theme());
    this.apply();
  }

  private apply() {
    document.documentElement.setAttribute('data-theme', this.theme());
  }
}