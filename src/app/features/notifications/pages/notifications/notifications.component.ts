import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { NotificationsService } from '@core/services/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications = signal<any[]>([]);
  tab = signal('all'); // 'all' | 'unread'
  hasMore = signal(true);
  loading = signal(false);

  page = 1;
  limit = 15;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

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