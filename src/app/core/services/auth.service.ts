import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string | null = null;
  user: User | null = null;

  constructor(private router: Router) {
    this.token = localStorage.getItem('token');

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch {
        this.user = null;
      }
    }
  }

  saveSession(token: string, user: User) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }


  updateUser(changes: Partial<User>) {
    if (!this.user) {
      return;
    }
    this.user = { ...this.user, ...changes };
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  clearSession() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/auth/signin']);
  }

 
  isLoggedIn(): boolean {
    if (!this.token) {
      return false;
    }
    try {
     
      const payload = JSON.parse(atob(this.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp) {
        return payload.exp * 1000 > Date.now();
      }
      return true;
    } catch {
      return false;
    }
  }
}