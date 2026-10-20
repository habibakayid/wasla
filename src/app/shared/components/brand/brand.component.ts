import { Component, input } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-brand',
  imports: [NgIf, RouterLink],
  template: `
    <a routerLink="/" class="inline-flex items-center gap-2.5" aria-label="Wasla home">
      <img src="brand/wasla-mark.png" alt="" class="block w-auto" [style.height.px]="size()" />
      <span *ngIf="showName()" class="flex flex-col leading-none">
        <span class="text-lg font-bold text-brand dark:text-rose" lang="ar">وَصلة</span>
        <span class="mt-1 text-[11px] tracking-[0.18em] text-brand dark:text-rose">WASLA</span>
      </span>
    </a>
  `,
})
export class BrandComponent {
  size = input(32); 
  showName = input(true);
}