import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() comment!: Comment;
  @Input() postId = '';
  @Input() postOwnerId = ''; 
  @Output() deleted = new EventEmitter<string>();

  isEditing = false;
  editText = '';

  showReplies = false;
  replies: any[] = [];
  loadingReplies = false;
  replyText = '';
  sendingReply = false;

  constructor(
    private commentsService: CommentsService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  get isMine(): boolean {
    return !!this.auth.user && this.auth.user._id === this.comment.commentCreator._id;
  }

  
  get canDelete(): boolean {
    const me = this.auth.user;
    return !!me && (me._id === this.comment.commentCreator._id || me._id === this.postOwnerId);
  }

  get isLiked(): boolean {
    return !!this.auth.user && this.comment.likes.includes(this.auth.user._id);
  }

  private setLiked(liked: boolean) {
    const me = this.auth.user;
    if (!me) {
      return;
    }
    const already = this.comment.likes.includes(me._id);
    if (liked && !already) {
      this.comment.likes = this.comment.likes.concat(me._id);
    }
    if (!liked && already) {
      this.comment.likes = this.comment.likes.filter((id) => id !== me._id);
    }
  }


  toggleLike() {
    const was = this.isLiked;
    this.setLiked(!was);

    this.commentsService.toggleLike(this.postId, this.comment._id).subscribe({
      error: () => {
        this.setLiked(was);
      },
    });
  }

  
  startEdit() {
    this.editText = this.comment.content;
    this.isEditing = true;
  }

  saveEdit() {
    this.commentsService.updateComment(this.postId, this.comment._id, this.editText).subscribe({
      next: () => {
        this.comment.content = this.editText;
        this.isEditing = false;
        this.toast.success('Comment updated');
      },
    });
  }


  remove() {
    if (!confirm('Delete this comment?')) {
      return;
    }
    this.commentsService.deleteComment(this.postId, this.comment._id).subscribe({
      next: () => {
        this.toast.success('Comment deleted');
        this.deleted.emit(this.comment._id);
      },
    });
  }


  toggleReplies() {
    this.showReplies = !this.showReplies;
    if (this.showReplies && this.replies.length === 0) {
      this.loadReplies();
    }
  }

  loadReplies() {
    this.loadingReplies = true;
    this.commentsService.getReplies(this.postId, this.comment._id, 1, 20).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.replies = res.data;
        } else {
          this.replies = res.data.replies || res.data.comments || [];
        }
        this.loadingReplies = false;
      },
      error: () => {
        this.loadingReplies = false;
      },
    });
  }

  sendReply() {
    if (this.replyText.trim() === '') {
      return;
    }
    this.sendingReply = true;

    this.commentsService.createReply(this.postId, this.comment._id, this.replyText).subscribe({
      next: () => {
        this.replyText = '';
        this.sendingReply = false;
        this.comment.repliesCount = (this.comment.repliesCount || 0) + 1;
        this.loadReplies(); 
      },
      error: () => {
        this.sendingReply = false;
      },
    });
  }
}