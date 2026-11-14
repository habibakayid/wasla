import { Component, OnInit, input, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';


@Component({
  selector: 'app-user-row',
  imports: [NgIf, RouterLink, TranslatePipe],
  template: `
    <div class="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl">
      <a [routerLink]="link()" class="shrink-0">
        <img [src]="user().photo" alt="" class="w-11 h-11 rounded-full object-cover bg-brand" />
      </a>
      <a [routerLink]="link()" class="flex-1 min-w-0">
        <p class="text-sm font-semibold truncate hover:underline">{{ user().name }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">&#64;{{ user().username }}</p>
      </a>

      <span *ngIf="isMe()" class="text-xs text-gray-500">{{ 'You' | t }}</span>
      <button
        *ngIf="!isMe()"
        type="button"
        (click)="follow()"
        class="text-xs font-medium px-3 py-1.5 rounded-lg border"
        [class]="followed()
          ? 'border-gray-300 text-gray-700 dark:text-gray-200 dark:border-neutral-600'
          : 'bg-brand text-white border-transparent hover:bg-brand-strong'"
      >
        {{ (followed() ? 'Following' : 'Follow') | t }}
      </button>
    </div>
  `,
})
export class UserRowComponent implements OnInit {
  user = input.required<any>();
  followed = signal(false);

  constructor(
    private auth: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    const u = this.user();
    
    this.followed.set(!!(u.followed ?? u.isFollowing ?? u.isFollowed));
  }

  isMe(): boolean {
    const me = this.auth.user();
    return !!me && me._id === this.user()._id;
  }

  link(): any[] {
    return this.isMe() ? ['/profile'] : ['/profile', this.user()._id];
  }

  follow() {
    const was = this.followed();
    this.followed.set(!was);
    this.usersService.toggleFollow(this.user()._id).subscribe({
      error: () => {
        this.followed.set(was);
      },
    });
  }
}