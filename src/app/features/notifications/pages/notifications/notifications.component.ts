import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { NotificationsService } from '@core/services/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  tab = 'all'; 
  page = 1;
  limit = 15;
  hasMore = true;
  loading = false;

  constructor(
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  changeTab(tab: string) {
    this.tab = tab;
    this.notifications = [];
    this.page = 1;
    this.hasMore = true;
    this.loading = false;
    this.load();
  }

  load() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    const unread = this.tab === 'unread' ? 'true' : 'false';

    this.notificationsService.getNotifications(unread, this.page, this.limit).subscribe({
      next: (res) => {
        const list: any[] = res.data.notifications || [];
        this.notifications = this.notifications.concat(list);

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore = pagination.currentPage < pagination.numberOfPages;
        } else {
          this.hasMore = list.length === this.limit;
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.load();
  }

  open(n: any) {
    
    if (!n.isRead) {
      n.isRead = true;
      this.notificationsService.markAsRead(n._id).subscribe({
        next: () => {
          this.notificationsService.refreshUnreadCount();
        },
        error: () => {
          n.isRead = false;
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
        for (const n of this.notifications) {
          n.isRead = true;
        }
        this.notificationsService.unreadCount = 0;
      },
    });
  }
}