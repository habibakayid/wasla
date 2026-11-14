import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cream dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <p class="text-6xl font-extrabold text-brand dark:text-rose">404</p>
      <p class="mt-2 mb-6">{{ "The page you're looking for doesn't exist." | t }}</p>
      <a routerLink="/" class="text-white bg-brand hover:bg-brand-strong font-medium rounded-lg text-sm px-5 py-2.5">{{ 'Back to home' | t }}</a>
    </div>
  `,
})
export class NotFoundComponent {}