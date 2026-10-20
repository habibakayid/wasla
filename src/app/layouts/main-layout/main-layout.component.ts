import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { UsersService } from '@core/services/users.service';
import { NotificationsService } from '@core/services/notifications.service';
import { BrandComponent } from '@shared/components/brand/brand.component';
import { SuggestionsComponent } from '@features/feed/components/suggestions/suggestions.component';

@Component({
  selector: 'app-main-layout',
  imports: [NgFor, NgIf, NgClass, DatePipe, RouterOutlet, RouterLink, RouterLinkActive, BrandComponent, SuggestionsComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  profile: any = null; 
  recent: any[] = [];
  collapsed = false;

  
links = [
  { label: 'Home', icon: 'fa-solid fa-house', path: '/', query: {}, exact: true },
  { label: 'Explore', icon: 'fa-solid fa-compass', path: '/explore', query: {}, exact: false },
  { label: 'Bookmarks', icon: 'fa-solid fa-bookmark', path: '/profile', query: { tab: 'saved' }, exact: false },
  { label: 'Notifications', icon: 'fa-solid fa-bell', path: '/notifications', query: {}, exact: false },
  { label: 'Profile', icon: 'fa-solid fa-user', path: '/profile', query: {}, exact: false },
  { label: 'Settings', icon: 'fa-solid fa-gear', path: '/settings', query: {}, exact: false },
];
  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    public notificationsService: NotificationsService,
    private usersService: UsersService
  ) {
    this.collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  }

  ngOnInit() {
    this.usersService.getMyProfile().subscribe({
      next: (res) => {
        
        this.profile = res.data.user || res.data;
      },
    });

    this.notificationsService.refreshUnreadCount();

    this.notificationsService.getNotifications('false', 1, 4).subscribe({
      next: (res) => {
        this.recent = res.data.notifications || [];
      },
    });
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    localStorage.setItem('sidebarCollapsed', String(this.collapsed));
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.auth.logout();
  }
}