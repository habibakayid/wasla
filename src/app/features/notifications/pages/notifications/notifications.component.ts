import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { NotificationsService } from '@core/services/notifications.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LocalizedDatePipe } from '@shared/pipes/localized-date.pipe';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-notifications',
  imports: [NgFor, NgIf, NgClass, TranslatePipe, LocalizedDatePipe, InfiniteScrollDirective],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications = signal<any[]>([]);
  tab = signal('all'); 
  hasMore = signal(true);
  loading = signal(false);
  markingAll = signal(false);

  page = 1;
  limit = 15;

  constructor(
    public notificationsService: NotificationsService,
    private router: Router,
    private translations: TranslationService,
    private toast: ToastService
  ) {}


  // private kind(n: any): string {
  //   const type = String(n.type || '').toLowerCase();
  //   if (type.includes('reply')) return 'reply';
  //   if (type.includes('comment')) return 'comment';
  //   if (type.includes('like')) return 'like';
  //   if (type.includes('share')) return 'share';
  //   if (type.includes('follow')) return 'follow';
  //   return 'other';
  // }
  private kind(n: any): string {
    return this.notificationsService.kind(n);
  }

  iconOf(n: any): { icon: string; bg: string } {
    switch (this.kind(n)) {
      case 'like':
        return { icon: 'fa-heart', bg: 'bg-rose' };
      case 'comment':
      case 'reply':
        return { icon: 'fa-comment', bg: 'bg-sky-500' };
      case 'share':
        return { icon: 'fa-retweet', bg: 'bg-violet-500' };
      case 'follow':
        return { icon: 'fa-user-plus', bg: 'bg-emerald-500' };
      default:
        return { icon: 'fa-bell', bg: 'bg-gray-500' };
    }
  }

 
  initial(n: any): string {
    const name: string = (n.actor && n.actor.name) || '?';
    return name.charAt(0).toUpperCase();
  }
  
  text(n: any): string {
    return this.notificationsService.describe(n);
  }


  ngOnInit() {
    this.load();
  }

  changeTab(tab: string) {
    this.tab.set(tab);
    this.notifications.set([]);
    this.page = 1;
    this.hasMore.set(true);
    this.loading.set(false);
    this.load();
  }

  load() {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);

    const unread = this.tab() === 'unread' ? 'true' : 'false';

    this.notificationsService.getNotifications(unread, this.page, this.limit).subscribe({
      next: (res) => {
        let list: any[] = res.data.notifications || [];
       
        if (this.tab() === 'unread') {
          list = list.filter((n) => !n.isRead);
        }


        this.notifications.update((old) => old.concat(list));

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore.set(pagination.currentPage < pagination.numberOfPages);
        } else {
          this.hasMore.set(list.length === this.limit);
        }

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.hasMore.set(false);
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.load();
  }

  trackById(index: number, item: { _id: string }) {
    return item._id;
  }

  private setRead(id: string, value: boolean) {
    this.notifications.update((list) => list.map((n) => (n._id === id ? { ...n, isRead: value } : n)));
  }

  open(n: any) {
    if (!n.isRead) {
      this.setRead(n._id, true);
      this.notificationsService.markAsRead(n._id).subscribe({
        next: () => {
          this.notificationsService.refreshUnreadCount();
        },
        error: () => {
          this.setRead(n._id, false);
        },
      });
    }

    
    if (this.kind(n) === 'follow') {
      if (n.actor && n.actor._id) {
        this.router.navigate(['/profile', n.actor._id]);
      }
      return;
    }
    const postId = n.entityType === 'post' ? n.entityId : (n.entity && (n.entity.post || n.entity._id));
    if (postId) {
      this.router.navigate(['/posts', postId]);
    }
  }

  
  private allDone() {
    this.notifications.update((list) => (this.tab() === 'unread' ? [] : list.map((n) => ({ ...n, isRead: true }))));
    this.notificationsService.unreadCount.set(0);
    this.notificationsService.refreshUnreadCount();
    this.markingAll.set(false);
    this.toast.success('All notifications marked as read');
  }

    
    markAllRead() {
    if (this.markingAll()) {
      return;
    }
    if (this.notificationsService.unreadCount() === 0 && !this.notifications().some((n) => !n.isRead)) {
      if (this.tab() === 'unread') {
        this.notifications.set([]);
      }
      this.toast.success('You\'re all caught up');
      return;
    }
    this.markingAll.set(true);

    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.allDone();
      },
      error: () => {
        
        const unread = this.notifications().filter((n) => !n.isRead);
        if (unread.length === 0) {
          this.markingAll.set(false);
          return;
        }
        forkJoin(unread.map((n) => this.notificationsService.markAsRead(n._id))).subscribe({
          next: () => {
            this.allDone();
          },
          error: () => {
            this.markingAll.set(false);
          },
        });
      },
    });
  }
}