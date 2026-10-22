import { Component, computed, model, output, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { PostsService } from '@core/services/posts.service';
import { ToastService } from '@core/services/toast.service';
import { Post } from '@core/models/post.model';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LocalizedDatePipe } from '@shared/pipes/localized-date.pipe';

@Component({
  selector: 'app-post-card',
  imports: [NgIf, NgFor, NgClass, FormsModule, RouterLink, TranslatePipe, LocalizedDatePipe],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  
  post = model.required<Post>();
  deleted = output<string>();

  isEditing = signal(false);
  editText = signal('');
  menuOpen = signal(false);

 
  isMine = computed(() => {
    const me = this.auth.user();
    return !!me && me._id === this.post().user._id;
  });

  isLiked = computed(() => {
    const me = this.auth.user();
    return !!me && this.post().likes.includes(me._id);
  });

  
  words = computed(() => (this.post().body || '').split(/(\s+)/));

  constructor(
    private postsService: PostsService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  
  private setLiked(liked: boolean) {
    const me = this.auth.user();
    if (!me) {
      return;
    }

    this.post.update((p) => {
      const already = p.likes.includes(me._id);
      if (liked && !already) {
        return { ...p, likes: [...p.likes, me._id], likesCount: p.likesCount + 1 };
      }
      if (!liked && already) {
        return { ...p, likes: p.likes.filter((id) => id !== me._id), likesCount: p.likesCount - 1 };
      }
      return p;
    });
  }

 
  toggleLike() {
    const wasLiked = this.isLiked();
    this.setLiked(!wasLiked);

    this.postsService.toggleLike(this.post()._id).subscribe({
      error: () => {
        this.setLiked(wasLiked); // فشل؟ نرجّع زي ما كان
      },
    });
  }

  toggleBookmark(showToast: boolean = true) {
    const was = this.post().bookmarked;
    this.post.update((p) => ({ ...p, bookmarked: !was }));

    this.postsService.toggleBookmark(this.post()._id).subscribe({
      next: () => {
        if (showToast) {
          const message = was ? 'Bookmark removed' : 'Post bookmarked!';
          this.toast.success(message, 'Undo', () => {
            this.toggleBookmark(false);
          });
        }
      },
      error: () => {
        this.post.update((p) => ({ ...p, bookmarked: was }));
      },
    });
  }

  
  share() {
    this.postsService.sharePost(this.post()._id).subscribe({
      next: () => {
        this.post.update((p) => ({ ...p, sharesCount: p.sharesCount + 1 }));
        this.toast.success('Post shared');
      },
    });
  }

  
  startEdit() {
    this.editText.set(this.post().body || '');
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  saveEdit() {
    const text = this.editText();
    this.postsService.updatePost(this.post()._id, text).subscribe({
      next: () => {
        this.post.update((p) => ({ ...p, body: text }));
        this.isEditing.set(false);
        this.toast.success('Post updated');
      },
    });
  }

 
  deletePost() {
    if (!confirm('Delete this post?')) {
      return;
    }

    this.postsService.deletePost(this.post()._id).subscribe({
      next: () => {
        this.toast.success('Post deleted');
        this.deleted.emit(this.post()._id);
      },
    });
  }
}