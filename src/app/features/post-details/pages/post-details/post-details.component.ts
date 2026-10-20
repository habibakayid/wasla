import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PostsService } from '@core/services/posts.service';
import { CommentsService } from '@core/services/comments.service';
import { ToastService } from '@core/services/toast.service';
import { Post } from '@core/models/post.model';
import { Comment } from '@core/models/comment.model';
import { PostCardComponent } from '@features/feed/components/post-card/post-card.component';
import { CommentItemComponent } from '../../components/comment-item/comment-item.component';

@Component({
  selector: 'app-post-details',
  imports: [NgIf, NgFor, FormsModule, RouterLink, PostCardComponent, CommentItemComponent],
  templateUrl: './post-details.component.html',
})
export class PostDetailsComponent implements OnInit {
  postId = '';
  post = signal<Post | null>(null);
  loadingPost = signal(true);

  comments = signal<Comment[]>([]);
  hasMore = signal(true);
  loadingComments = signal(false);

  newComment = signal('');
  imageFile = signal<File | null>(null);
  sending = signal(false);

  page = 1;
  limit = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';

    this.postsService.getPost(this.postId).subscribe({
      next: (res) => {
       
        this.post.set(res.data.post || res.data);
        this.loadingPost.set(false);
      },
      error: () => {
        this.loadingPost.set(false);
      },
    });

    this.loadComments();
  }

  loadComments() {
    if (this.loadingComments()) {
      return;
    }
    this.loadingComments.set(true);

    this.commentsService.getComments(this.postId, this.page, this.limit).subscribe({
      next: (res) => {
        let list: Comment[] = [];
        if (Array.isArray(res.data)) {
          list = res.data;
        } else {
          list = res.data.comments || [];
        }
        this.comments.update((old) => old.concat(list));

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore.set(pagination.currentPage < pagination.numberOfPages);
        } else {
          this.hasMore.set(list.length === this.limit);
        }

        this.loadingComments.set(false);
      },
      error: () => {
        this.loadingComments.set(false);
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.loadComments();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile.set(input.files[0]);
    }
  }

  sendComment() {
    if (this.newComment().trim() === '' && !this.imageFile()) {
      return;
    }
    this.sending.set(true);

    this.commentsService.createComment(this.postId, this.newComment(), this.imageFile()).subscribe({
      next: () => {
        this.newComment.set('');
        this.imageFile.set(null);
        this.sending.set(false);
        this.toast.success('Comment added');

       
        this.comments.set([]);
        this.page = 1;
        this.hasMore.set(true);
        this.loadingComments.set(false);
        this.loadComments();
        this.post.update((p) => (p ? { ...p, commentsCount: p.commentsCount + 1 } : p));
      },
      error: () => {
        this.sending.set(false);
      },
    });
  }

  trackById(index: number, item: { _id: string }) {
    return item._id;
  }

  
  replaceComment(updated: Comment) {
    this.comments.update((list) => list.map((c) => (c._id === updated._id ? updated : c)));
  }

  removeComment(commentId: string) {
    this.comments.update((list) => list.filter((c) => c._id !== commentId));
    this.post.update((p) => (p ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p));
  }


  onPostDeleted() {
    this.router.navigate(['/']);
  }
}