import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';


function minAge13(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const born = new Date(control.value + 'T00:00:00');
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 13);
  return born <= limit ? null : { minAge: true };
}

@Component({
  selector: 'app-signup',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  form = new FormGroup({
   
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rePassword: new FormControl('', [Validators.required]),
   
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^\S+$/)]),
    dateOfBirth: new FormControl('', [Validators.required, minAge13]),
    gender: new FormControl('', [Validators.required]),
  });

  step = 1; 
  showPassword = false;
  loading = false;
  maxDate = new Date().toISOString().split('T')[0]; 

  constructor(
    private usersService: UsersService,
    private auth: AuthService,
    private router: Router
  ) {}


  hasError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.touched && control.invalid;
  }

  
  get passwordsDiffer(): boolean {
    return this.form.value.password !== this.form.value.rePassword;
  }

  get step1Valid(): boolean {
    const names = ['name', 'email', 'password', 'rePassword'];
    return names.every((n) => this.form.get(n)!.valid) && !this.passwordsDiffer;
  }

  next() {
    ['name', 'email', 'password', 'rePassword'].forEach((n) => this.form.get(n)!.markAsTouched());
    if (this.step1Valid) {
      this.step = 2;
    }
  }

  back() {
    this.step = 1;
  }

  submit() {
   
    if (this.step === 1) {
      this.next();
      return;
    }
    if (this.form.invalid || this.passwordsDiffer) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.usersService.signup(this.form.value).subscribe({
      next: (res) => {
        this.auth.saveSession(res.data.token, res.data.user);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}