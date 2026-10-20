import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  unreadCount = signal(0);

  constructor(private http: HttpClient) {}

  getNotifications(unread: string, page: number, limit: number) {
    return this.http.get<any>(API_URL + '/notifications?unread=' + unread + '&page=' + page + '&limit=' + limit);
  }

  getUnreadCount() {
    return this.http.get<any>(API_URL + '/notifications/unread-count');
  }

  refreshUnreadCount() {
    this.getUnreadCount().subscribe({
      next: (res) => {
        if (typeof res.data === 'number') {
          this.unreadCount.set(res.data);
        } else if (res.data) {
          this.unreadCount.set(res.data.unreadCount || res.data.count || res.data.unread || 0);
        }
      },
    });
  }

  markAsRead(notificationId: string) {
    return this.http.patch<any>(API_URL + '/notifications/' + notificationId + '/read', {});
  }

  markAllAsRead() {
    return this.http.patch<any>(API_URL + '/notifications/read-all', {});
  }
}