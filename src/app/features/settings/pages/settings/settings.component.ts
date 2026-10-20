import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { ToastService } from '@core/services/toast.service';
import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-settings',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm: new FormControl('', [Validators.required]),
  });

  submitted = false;
  savingPassword = false;
  uploading = false;

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private usersService: UsersService,
    private toast: ToastService
  ) {}

  hasError(name: string): boolean {
    const control = this.passwordForm.get(name);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  get passwordsDiffer(): boolean {
    const v = this.passwordForm.value;
    return this.submitted && v.newPassword !== v.confirm;
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.auth.logout();
  }

 
  changePassword() {
    this.submitted = true;
    if (this.passwordForm.invalid || this.passwordsDiffer) {
      return;
    }

    const v = this.passwordForm.value;
    this.savingPassword = true;

    this.usersService.changePassword(v.password || '', v.newPassword || '').subscribe({
      next: () => {
        this.toast.success('Password changed');
        this.passwordForm.reset();
        this.submitted = false;
        this.savingPassword = false;
      },
      error: () => {
        this.savingPassword = false;
      },
    });
  }

  
  onPhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('Image must be smaller than 5MB.');
      return;
    }

    this.uploading = true;

    this.usersService.uploadPhoto(file).subscribe({
      next: (res) => {
        
        const newPhoto = (res.data && (res.data.photo || (res.data.user && res.data.user.photo))) || '';
        if (newPhoto) {
          this.auth.updateUser({ photo: newPhoto });
        }
        this.toast.success('Profile photo updated');
        this.uploading = false;
      },
      error: () => {
        this.uploading = false;
      },
    });
  }
}