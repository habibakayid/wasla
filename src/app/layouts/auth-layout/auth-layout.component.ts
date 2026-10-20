import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrandComponent } from '@shared/components/brand/brand.component';


@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, BrandComponent],
  template: `
    <main class="auth-page">
      <section class="auth-card">
        <div class="auth-brand">
          <app-brand [size]="44" />
        </div>
        <router-outlet />
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {}