import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { NotificationsService } from '@core/services/notifications.service';
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

  page = 1;
  limit = 15;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private translations: TranslationService
  ) {}

  
  text(n: any): string {
    const type = String(n.type || '').toLowerCase();
    let text = '';
    if (type.includes('reply')) {
      text = 'replied to your comment';
    } else if (type.includes('comment')) {
      text = 'commented on your post';
    } else if (type.includes('like')) {
      text = 'liked your post';
    } else if (type.includes('share')) {
      text = 'shared your post';
    } else if (type.includes('follow')) {
      text = 'started following you';
    }
    
    if (text && this.translations.language() === 'ar') {
      return this.translations.translate(text);
    }
    return n.message || text || n.type;
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
        const list: any[] = res.data.notifications || [];
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

   
    const postId = (n.entity && n.entity._id) || n.postId || (n.post && n.post._id);
    if (postId) {
      this.router.navigate(['/posts', postId]);
    } else if (n.sender && n.sender._id) {
      
      this.router.navigate(['/profile', n.sender._id]);
    }
  }

  markAllRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
        this.notificationsService.unreadCount.set(0);
      },
    });
  }
}