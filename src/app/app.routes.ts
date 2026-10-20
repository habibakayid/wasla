import { Routes } from '@angular/router';

import { AuthGuard, GuestGuard } from '@core/guards/auth.guard';


export const routes: Routes = [
 
  {
    path: 'auth',
    canActivate: [GuestGuard],
    loadComponent: () => import('@layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      {
        path: 'signin',
        title: 'Sign in · Wasla',
        loadComponent: () => import('@features/auth/pages/signin/signin.component').then((m) => m.SigninComponent),
      },
      {
        path: 'signup',
        title: 'Sign up · Wasla',
        loadComponent: () => import('@features/auth/pages/signup/signup.component').then((m) => m.SignupComponent),
      },
    ],
  },

 
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('@layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Home · Wasla',
        loadComponent: () => import('@features/feed/pages/feed/feed.component').then((m) => m.FeedComponent),
      },
      {
        path: 'explore',
        title: 'Explore · Wasla',
        loadComponent: () => import('@features/feed/pages/explore/explore.component').then((m) => m.ExploreComponent),
      },
      {
        path: 'posts/:id',
        title: 'Post · Wasla',
        loadComponent: () =>
          import('@features/post-details/pages/post-details/post-details.component').then((m) => m.PostDetailsComponent),
      },
      {
        path: 'profile',
        title: 'Profile · Wasla',
        loadComponent: () => import('@features/profile/pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'notifications',
        title: 'Notifications · Wasla',
        loadComponent: () =>
          import('@features/notifications/pages/notifications/notifications.component').then((m) => m.NotificationsComponent),
      },
      {
        path: 'settings',
        title: 'Settings · Wasla',
        loadComponent: () => import('@features/settings/pages/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },

 
  // {
  //   path: '**',
  //   title: 'Not found · Wasla',
  //   loadComponent: () => import('@features/not-found/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  // },
];