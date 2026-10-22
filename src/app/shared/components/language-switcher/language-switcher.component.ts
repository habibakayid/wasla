import { Component, inject } from '@angular/core';

import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <button
      type="button"
      (click)="translations.toggleLanguage()"
      class="px-3 py-2 rounded-full border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-semibold shadow-sm"
      [attr.aria-label]="translations.language() === 'en' ? 'التبديل إلى اللغة العربية' : 'Switch to English'"
    >
      {{ translations.language() === 'en' ? 'العربية' : 'English' }}
    </button>
  `,
})
export class LanguageSwitcherComponent {
  readonly translations = inject(TranslationService);
}
