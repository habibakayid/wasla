import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrandComponent } from '@shared/components/brand/brand.component';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher/language-switcher.component';


@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, BrandComponent, LanguageSwitcherComponent],
  template: `
    <main class="auth-page">
      <section class="auth-card">
        <div class="flex justify-end mb-3">
          <app-language-switcher />
        </div>
        <div class="auth-brand">
          <app-brand [size]="44" />
        </div>
        <router-outlet />
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {}