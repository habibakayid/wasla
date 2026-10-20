import { Routes } from '@angular/router';

import { AuthGuard, GuestGuard } from '@core/guards/auth.guard';

import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';

import { SigninComponent } from '@features/auth/pages/signin/signin.component';
import { SignupComponent } from '@features/auth/pages/signup/signup.component';
import { FeedComponent } from '@features/feed/pages/feed/feed.component';
import { ExploreComponent } from '@features/feed/pages/explore/explore.component';
import { PostDetailsComponent } from '@features/post-details/pages/post-details/post-details.component';
import { ProfileComponent } from '@features/profile/pages/profile/profile.component';
import { NotificationsComponent } from '@features/notifications/pages/notifications/notifications.component';
import { SettingsComponent } from '@features/settings/pages/settings/settings.component';
// import { NotFoundComponent } from '@features/not-found/pages/not-found/not-found.component';

export const routes: Routes = [
  
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [GuestGuard],
    children: [
      { path: '', redirectTo: 'signin', pathMatch: 'full' },
      { path: 'signin', component: SigninComponent, title: 'Sign in · Wasla' },
      { path: 'signup', component: SignupComponent, title: 'Sign up · Wasla' },
    ],
  },

  
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: FeedComponent, pathMatch: 'full', title: 'Home · Wasla' },
      { path: 'explore', component: ExploreComponent, title: 'Explore · Wasla' },
      { path: 'posts/:id', component: PostDetailsComponent, title: 'Post · Wasla' },
      { path: 'profile', component: ProfileComponent, title: 'Profile · Wasla' },
      { path: 'notifications', component: NotificationsComponent, title: 'Notifications · Wasla' },
      { path: 'settings', component: SettingsComponent, title: 'Settings · Wasla' },
    ],
  },

 
//   { path: '**', component: NotFoundComponent, title: 'Not found · Wasla' },
];