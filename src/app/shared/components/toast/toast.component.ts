import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  template: `
    <div class="fixed bottom-20 lg:bottom-6 inset-x-4 z-50 flex flex-col items-center gap-2 pointer-events-none">

      <div
        *ngFor="let t of toastService.toasts()"
        class="pointer-events-auto flex items-center w-full max-w-md p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700"
      >
        <div
          class="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg"
          [ngClass]="{
            'text-green-600 bg-green-100': t.type === 'success',
            'text-red-600 bg-red-100': t.type === 'error',
            'text-yellow-600 bg-yellow-100': t.type === 'info'
          }"
        >
          <i *ngIf="t.type === 'success'" class="fa-solid fa-check" aria-hidden="true"></i>
          <i *ngIf="t.type === 'error'" class="fa-solid fa-exclamation" aria-hidden="true"></i>
          <i *ngIf="t.type === 'info'" class="fa-solid fa-circle-info" aria-hidden="true"></i>
        </div>

        <div class="ms-3 text-sm flex-1 text-gray-800 dark:text-gray-100">
          {{ t.message }}
        </div>

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
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>

    </div>
  `,
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}