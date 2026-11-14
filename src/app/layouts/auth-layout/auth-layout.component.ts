import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BrandComponent } from '@shared/components/brand/brand.component';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher/language-switcher.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-auth-layout',
  imports: [NgFor, RouterOutlet, BrandComponent, LanguageSwitcherComponent, TranslatePipe],
  template: `
    <main class="min-h-screen grid lg:grid-cols-2 bg-cream">
     
      <section
        class="hidden lg:flex relative flex-col justify-between overflow-hidden px-14 py-12 text-white bg-gradient-to-br from-[#3b0c18] via-brand to-[#8a2a43]"
      >
        <span class="pointer-events-none absolute -top-24 -end-24 w-96 h-96 rounded-full bg-white/5"></span>
        <span class="pointer-events-none absolute -bottom-32 -start-20 w-96 h-96 rounded-full bg-gold/10"></span>

        <div class="relative rounded-2xl bg-white/95 w-fit px-4 py-2 shadow-lg">
          <app-brand [size]="40" />
        </div>

        <div class="relative max-w-xl">
          <h1 class="text-5xl font-extrabold leading-tight">
            {{ 'Connect with people around you.' | t }}
          </h1>
          <p class="mt-5 text-lg text-white/80 leading-relaxed">
            {{ 'Wasla is a social network where you share moments, follow people you like and join the conversation.' | t }}
          </p>

          <ul class="mt-10 grid sm:grid-cols-2 gap-4">
            <li
              *ngFor="let f of features"
              class="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4"
            >
              <span class="shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <i class="fa-solid" [class]="f.icon"></i>
              </span>
              <span>
                <span class="block font-semibold">{{ f.title | t }}</span>
                <span class="block text-sm text-white/70 mt-0.5">{{ f.text | t }}</span>
              </span>
            </li>
          </ul>
        </div>

        <p class="relative text-sm text-white/60">© Wasla · وَصلة</p>
      </section>

      
      <section class="relative flex items-center justify-center px-4 py-10 sm:px-8">
        <div class="absolute top-4 end-4">
          <app-language-switcher />
        </div>

        <div class="w-full max-w-md">
          <div class="lg:hidden flex justify-center mb-6">
            <app-brand [size]="44" />
          </div>
          <div class="rounded-3xl bg-white dark:bg-neutral-800 shadow-xl border border-[#e8dacb] p-7 sm:p-9">
            <router-outlet />
          </div>
        </div>
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {
  features = [
    { icon: 'fa-regular fa-image', title: 'Share moments', text: 'Post text and photos with your people.' },
    { icon: 'fa-solid fa-user-group', title: 'Follow people', text: 'Build your feed from people you like.' },
    { icon: 'fa-regular fa-heart', title: 'Like & comment', text: 'React, reply and keep the talk going.' },
    { icon: 'fa-regular fa-bookmark', title: 'Save posts', text: 'Keep what you love for later.' },
  ];
}