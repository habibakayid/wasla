import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [NgFor, NgIf, NgClass],
  template: `
    <div class="fixed bottom-20 lg:bottom-6 inset-x-4 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <div
        *ngFor="let t of toastService.toasts"
        class="pointer-events-auto flex items-center w-full max-w-sm p-4 rounded-lg shadow-lg border bg-white dark:bg-neutral-800"
        [ngClass]="{
          'border-green-300': t.type === 'success',
          'border-red-300': t.type === 'error',
          'border-yellow-300': t.type === 'info'
        }"
        role="alert"
      >
        <div
          class="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg font-bold"
          [ngClass]="{
            'text-green-600 bg-green-100': t.type === 'success',
            'text-red-600 bg-red-100': t.type === 'error',
            'text-yellow-600 bg-yellow-100': t.type === 'info'
          }"
        >
          <span *ngIf="t.type === 'success'">✓</span>
          <span *ngIf="t.type === 'error'">!</span>
          <span *ngIf="t.type === 'info'">i</span>
        </div>
        <div class="ms-3 text-sm flex-1 text-gray-800 dark:text-gray-100">{{ t.message }}</div>
        <button
          *ngIf="t.actionLabel"
          type="button"
          (click)="toastService.runAction(t)"
          class="ms-3 text-sm font-semibold text-brand dark:text-rose underline"
        >
          {{ t.actionLabel }}
        </button>
        <button
          type="button"
          (click)="toastService.remove(t.id)"
          class="ms-3 text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}