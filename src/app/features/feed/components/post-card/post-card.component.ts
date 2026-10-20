import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { PostsService } from '@core/services/posts.service';
import { ToastService } from '@core/services/toast.service';
import { Post } from '@core/models/post.model';

@Component({
  selector: 'app-post-card',
  imports: [NgIf, NgFor, NgClass, DatePipe, FormsModule, RouterLink],
  templateUrl: './post-card.component.html',
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() deleted = new EventEmitter<string>();
  @Output() bookmarkChanged = new EventEmitter<void>(); 

  isEditing = false;
  editText = '';
  menuOpen = false;

  constructor(
    private postsService: PostsService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

 
  get isMine(): boolean {
    return !!this.auth.user && this.auth.user._id === this.post.user._id;
  }

  
  get isLiked(): boolean {
    return !!this.auth.user && this.post.likes.includes(this.auth.user._id);
  }

  
  get words(): string[] {
    return (this.post.body || '').split(/(\s+)/);
  }

  
  private setLiked(liked: boolean) {
    const me = this.auth.user;
    if (!me) {
      return;
    }
    const alreadyLiked = this.post.likes.includes(me._id);

    if (liked && !alreadyLiked) {
      this.post.likes = this.post.likes.concat(me._id);
      this.post.likesCount = this.post.likesCount + 1;
    }
    if (!liked && alreadyLiked) {
      this.post.likes = this.post.likes.filter((id) => id !== me._id);
      this.post.likesCount = this.post.likesCount - 1;
    }
  }

  
  toggleLike() {
    const wasLiked = this.isLiked;
    this.setLiked(!wasLiked);

    this.postsService.toggleLike(this.post._id).subscribe({
      error: () => {
        this.setLiked(wasLiked); // فشل؟ نرجّع زي ما كان
      },
    });
  }

 
  toggleBookmark(showToast: boolean = true) {
    const was = this.post.bookmarked;
    this.post.bookmarked = !was;

    this.postsService.toggleBookmark(this.post._id).subscribe({
      next: () => {
        if (showToast) {
          const message = was ? 'Bookmark removed' : 'Post bookmarked!';
          this.toast.success(message, 'Undo', () => {
            this.toggleBookmark(false);
          });
        }
        this.bookmarkChanged.emit();
      },
      error: () => {
        this.post.bookmarked = was;
      },
    });
  }

  
  share() {
    this.postsService.sharePost(this.post._id).subscribe({
      next: () => {
        this.post.sharesCount = this.post.sharesCount + 1;
        this.toast.success('Post shared');
      },
    });
  }

 
  startEdit() {
    this.editText = this.post.body || '';
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveEdit() {
    this.postsService.updatePost(this.post._id, this.editText).subscribe({
      next: () => {
        this.post.body = this.editText;
        this.isEditing = false;
        this.toast.success('Post updated');
      },
    });
  }


  deletePost() {
    if (!confirm('Delete this post?')) {
      return;
    }

    this.postsService.deletePost(this.post._id).subscribe({
      next: () => {
        this.toast.success('Post deleted');
        this.deleted.emit(this.post._id);
      },
    });
  }
}