import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-signin',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  showPassword = false;
  loading = false;
  submitted = false;

  constructor(
    private usersService: UsersService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  
  hasError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.usersService.signin(this.form.value).subscribe({
      next: (res) => {
        this.auth.saveSession(res.data.token, res.data.user);

       
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
          returnUrl = '/';
        }
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading = false; 
      },
    });
  }
}