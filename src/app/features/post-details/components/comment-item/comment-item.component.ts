import { Component, computed, input, model, output, signal } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { CommentsService } from '@core/services/comments.service';
import { ToastService } from '@core/services/toast.service';
import { Comment } from '@core/models/comment.model';

@Component({
  selector: 'app-comment-item',
  imports: [NgIf, NgFor, NgClass, DatePipe, FormsModule],
  templateUrl: './comment-item.component.html',
})
export class CommentItemComponent {
  comment = model.required<Comment>();
  postId = input('');
  postOwnerId = input(''); 
  deleted = output<string>();

  isEditing = signal(false);
  editText = signal('');

  showReplies = signal(false);
  replies = signal<any[]>([]);
  loadingReplies = signal(false);
  replyText = signal('');
  sendingReply = signal(false);

  isMine = computed(() => {
    const me = this.auth.user();
    return !!me && me._id === this.comment().commentCreator._id;
  });


  canDelete = computed(() => {
    const me = this.auth.user();
    return !!me && (me._id === this.comment().commentCreator._id || me._id === this.postOwnerId());
  });

  isLiked = computed(() => {
    const me = this.auth.user();
    return !!me && this.comment().likes.includes(me._id);
  });

  constructor(
    private commentsService: CommentsService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  private setLiked(liked: boolean) {
    const me = this.auth.user();
    if (!me) {
      return;
    }
    this.comment.update((c) => {
      const already = c.likes.includes(me._id);
      if (liked && !already) {
        return { ...c, likes: [...c.likes, me._id] };
      }
      if (!liked && already) {
        return { ...c, likes: c.likes.filter((id) => id !== me._id) };
      }
      return c;
    });
  }

  toggleLike() {
    const was = this.isLiked();
    this.setLiked(!was);

    this.commentsService.toggleLike(this.postId(), this.comment()._id).subscribe({
      error: () => {
        this.setLiked(was);
      },
    });
  }

  
  startEdit() {
    this.editText.set(this.comment().content);
    this.isEditing.set(true);
  }

  saveEdit() {
    const text = this.editText();
    this.commentsService.updateComment(this.postId(), this.comment()._id, text).subscribe({
      next: () => {
        this.comment.update((c) => ({ ...c, content: text }));
        this.isEditing.set(false);
        this.toast.success('Comment updated');
      },
    });
  }

  
  remove() {
    if (!confirm('Delete this comment?')) {
      return;
    }
    this.commentsService.deleteComment(this.postId(), this.comment()._id).subscribe({
      next: () => {
        this.toast.success('Comment deleted');
        this.deleted.emit(this.comment()._id);
      },
    });
  }

  
  toggleReplies() {
    this.showReplies.set(!this.showReplies());
    if (this.showReplies() && this.replies().length === 0) {
      this.loadReplies();
    }
  }

  loadReplies() {
    this.loadingReplies.set(true);
    this.commentsService.getReplies(this.postId(), this.comment()._id, 1, 20).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.replies.set(res.data);
        } else {
          this.replies.set(res.data.replies || res.data.comments || []);
        }
        this.loadingReplies.set(false);
      },
      error: () => {
        this.loadingReplies.set(false);
      },
    });
  }

  sendReply() {
    if (this.replyText().trim() === '') {
      return;
    }
    this.sendingReply.set(true);

    this.commentsService.createReply(this.postId(), this.comment()._id, this.replyText()).subscribe({
      next: () => {
        this.replyText.set('');
        this.sendingReply.set(false);
        this.comment.update((c) => ({ ...c, repliesCount: (c.repliesCount || 0) + 1 }));
        this.loadReplies(); 
      },
      error: () => {
        this.sendingReply.set(false);
      },
    });
  }
}