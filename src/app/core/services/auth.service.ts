import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(null);
  user = signal<User | null>(null);

  constructor(private router: Router) {
    this.token.set(localStorage.getItem('token'));

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user.set(JSON.parse(savedUser));
      } catch {
        this.user.set(null);
      }
    }
  }

  saveSession(token: string, user: User) {
    this.token.set(token);
    this.user.set(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }


  updateUser(changes: Partial<User>) {
    const current = this.user();
    if (!current) {
      return;
    }
    const next = { ...current, ...changes };
    this.user.set(next);
    localStorage.setItem('user', JSON.stringify(next));
  }

  clearSession() {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/auth/signin']);
  }

  
  isLoggedIn(): boolean {
    const token = this.token();
    if (!token) {
      return false;
    }
    try {
    
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp) {
        return payload.exp * 1000 > Date.now();
      }
      return true;
    } catch {
      return false;
    }
  }
}