import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

import { API_URL } from '../config';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;

    
    if (this.auth.token && req.url.startsWith(API_URL)) {
      request = req.clone({
        setHeaders: { Authorization: 'Bearer ' + this.auth.token },
      });
    }

  
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthCall = req.url.includes('/users/signin') || req.url.includes('/users/signup');

        if (error.status === 401 && this.auth.token && !isAuthCall) {
          
          this.auth.clearSession();
          this.toast.error('Your session has expired. Please sign in again.');
          this.router.navigate(['/auth/signin']);
        } else {
          let message = 'Something went wrong. Please try again.';
          if (error.error && error.error.message) {
            message = error.error.message;
          }
          this.toast.error(message);
        }

        return throwError(() => error);
      })
    );
  }
}