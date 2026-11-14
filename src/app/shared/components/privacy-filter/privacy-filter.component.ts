import { Component, model } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

import { PRIVACY_OPTIONS } from '@core/utils/privacy';
import { TranslatePipe } from '@shared/pipes/translate.pipe';


@Component({
  selector: 'app-privacy-filter',
  imports: [NgFor, NgClass, TranslatePipe],
  template: `
    <div class="flex flex-wrap items-center gap-2 mb-4" role="group" [attr.aria-label]="'Privacy' | t">
      <button
        type="button"
        (click)="value.set('all')"
        class="px-3 py-1 rounded-full text-xs font-medium border"
        [ngClass]="chip(value() === 'all')"
      >
        {{ 'All' | t }}
      </button>
      <button
        *ngFor="let o of options"
        type="button"
        (click)="value.set(o.key)"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
        [ngClass]="chip(value() === o.key)"
      >
        <i class="fa-solid" [ngClass]="o.icon"></i>
        {{ o.label | t }}
      </button>
    </div>
  `,
})
export class PrivacyFilterComponent {
  value = model('all'); 
  options = PRIVACY_OPTIONS;

  chip(active: boolean): string {
    return active
      ? 'bg-brand text-white border-transparent'
      : 'bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200';
  }
}