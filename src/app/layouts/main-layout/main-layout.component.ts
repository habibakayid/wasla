import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { UsersService } from '@core/services/users.service';
import { NotificationsService } from '@core/services/notifications.service';
import { TranslationService } from '@core/services/translation.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LocalizedDatePipe } from '@shared/pipes/localized-date.pipe';
import { BrandComponent } from '@shared/components/brand/brand.component';
import { LanguageSwitcherComponent } from '@shared/components/language-switcher/language-switcher.component';
import { SuggestionsComponent } from '@features/feed/components/suggestions/suggestions.component';

@Component({
  selector: 'app-main-layout',
  imports: [NgFor, NgIf, NgClass, RouterOutlet, RouterLink, RouterLinkActive, BrandComponent, SuggestionsComponent, LanguageSwitcherComponent, TranslatePipe, LocalizedDatePipe],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  profile = signal<any>(null); 
  recent = signal<any[]>([]); 
  collapsed = signal(false); 
  searchText = signal(''); 
  private search$ = new Subject<string>();

  
  links = [
    { label: 'Home', icon: 'fa-house', path: '/', query: {}, exact: true },
    { label: 'Explore', icon: 'fa-compass', path: '/explore', query: {}, exact: false },
    { label: 'Bookmarks', icon: 'fa-bookmark', path: '/profile', query: { tab: 'saved' }, exact: false },
    { label: 'Notifications', icon: 'fa-bell', path: '/notifications', query: {}, exact: false },
    { label: 'Profile', icon: 'fa-user', path: '/profile', query: {}, exact: false },
    { label: 'Settings', icon: 'fa-gear', path: '/settings', query: {}, exact: false },
  ];

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    public notificationsService: NotificationsService,
    public translations: TranslationService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.collapsed.set(localStorage.getItem('sidebarCollapsed') === 'true');

    
    this.search$.pipe(debounceTime(400), distinctUntilChanged()).subscribe((q) => {
      this.router.navigate(['/search'], { queryParams: q ? { q: q } : {} });
    });

   
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      const tree = this.router.parseUrl(e.urlAfterRedirects);
      const onSearch = tree.root.children['primary']?.segments[0]?.path === 'search';
      const q = onSearch ? (tree.queryParams['q'] || '') : '';
      if (q !== this.searchText().trim()) {
        this.searchText.set(q);
      }
    });
  }

  onSearchInput(value: string) {
    this.searchText.set(value);
    this.search$.next(value.trim());
  }

  
  submitSearch() {
    const q = this.searchText().trim();
    this.router.navigate(['/search'], { queryParams: q ? { q: q } : {} });
  }

 
  senderLink(sender: any): any[] {
    const me = this.auth.user();
    return me && sender && me._id === sender._id ? ['/profile'] : ['/profile', sender && sender._id];
  }

  ngOnInit() {
    this.usersService.getMyProfile().subscribe({
      next: (res) => {
       
        this.profile.set(res.data.user || res.data);
      },
    });

    this.notificationsService.refreshUnreadCount();

    this.notificationsService.getNotifications('false', 1, 4).subscribe({
      next: (res) => {
        this.recent.set(res.data.notifications || []);
      },
    });
  }

  toggleSidebar() {
    this.collapsed.update((value) => !value);
    localStorage.setItem('sidebarCollapsed', String(this.collapsed()));
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.auth.logout();
  }
}