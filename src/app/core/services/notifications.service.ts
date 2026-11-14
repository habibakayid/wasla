import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config';
import { TranslationService } from './translation.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  unreadCount = signal(0);

  constructor(
    private http: HttpClient,
    private translations: TranslationService
  ) {}


  // getNotifications(unread: string, page: number, limit: number) {
  //   let url = API_URL + '/notifications?page=' + page + '&limit=' + limit;
  //   if (unread === 'true') {
  //     url = url + '&unread=true';
  //   }
  //   return this.http.get<any>(url);
  // }
  getNotifications(unread: string, page: number, limit: number) {
  
  return this.http.get<any>(API_URL + '/notifications?page=' + page + '&limit=' + limit);
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


  kind(n: any): string {
    const type = String(n.type || '').toLowerCase();
    if (type.includes('reply')) return 'reply';
    if (type.includes('comment')) return 'comment';
    if (type.includes('like')) return 'like';
    if (type.includes('share')) return 'share';
    if (type.includes('follow')) return 'follow';
    return 'other';
  }

 
  describe(n: any): string {
    const map: Record<string, string> = {
      reply: 'replied to your comment',
      comment: 'commented on your post',
      like: 'liked your post',
      share: 'shared your post',
      follow: 'started following you',
    };
    const text = map[this.kind(n)];
    return text ? this.translations.translate(text) : String(n.type || '');
  }
}