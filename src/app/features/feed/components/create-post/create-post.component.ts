import { Component, output, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { PostsService } from '@core/services/posts.service';
import { ToastService } from '@core/services/toast.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-create-post',
  imports: [NgIf, FormsModule, TranslatePipe],
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  
  created = output<void>();

  body = signal('');
  privacy = signal('public'); 
  imageFile = signal<File | null>(null);
  imagePreview = signal('');
  sending = signal(false);

  constructor(
    public auth: AuthService,
    private postsService: PostsService,
    private toast: ToastService
  ) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      
      if (!file.type.startsWith('image/')) {
        this.toast.error('Please choose an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('Image must be smaller than 5MB.');
        return;
      }

      this.imageFile.set(file);
      this.imagePreview.set(URL.createObjectURL(file));
    }
  }

  removeImage() {
    this.imageFile.set(null);
    this.imagePreview.set('');
  }

  submit() {
    if (this.body().trim() === '' && !this.imageFile()) {
      return;
    }

    this.sending.set(true);

    this.postsService.createPost(this.body(), this.imageFile(), this.privacy()).subscribe({
      next: () => {
        this.body.set('');
        this.removeImage();
        this.sending.set(false);
        this.toast.success('Post published');
        this.created.emit();
      },
      error: () => {
        this.sending.set(false);
      },
    });
  }
}