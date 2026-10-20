import { Component, OnInit } from '@angular/core';
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
  post: Post | null = null;
  loadingPost = true;

  comments: Comment[] = [];
  page = 1;
  limit = 10;
  hasMore = true;
  loadingComments = false;

  newComment = '';
  imageFile: File | null = null;
  sending = false;

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
        
        this.post = res.data.post || res.data;
        this.loadingPost = false;
      },
      error: () => {
        this.loadingPost = false;
      },
    });

    this.loadComments();
  }

  loadComments() {
    if (this.loadingComments) {
      return;
    }
    this.loadingComments = true;

    this.commentsService.getComments(this.postId, this.page, this.limit).subscribe({
      next: (res) => {
        let list: Comment[] = [];
        if (Array.isArray(res.data)) {
          list = res.data;
        } else {
          list = res.data.comments || [];
        }
        this.comments = this.comments.concat(list);

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore = pagination.currentPage < pagination.numberOfPages;
        } else {
          this.hasMore = list.length === this.limit;
        }

        this.loadingComments = false;
      },
      error: () => {
        this.loadingComments = false;
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
      this.imageFile = input.files[0];
    }
  }

  sendComment() {
    if (this.newComment.trim() === '' && !this.imageFile) {
      return;
    }
    this.sending = true;

    this.commentsService.createComment(this.postId, this.newComment, this.imageFile).subscribe({
      next: () => {
        this.newComment = '';
        this.imageFile = null;
        this.sending = false;
        this.toast.success('Comment added');

        
        this.comments = [];
        this.page = 1;
        this.hasMore = true;
        this.loadingComments = false;
        this.loadComments();
        if (this.post) {
          this.post.commentsCount = this.post.commentsCount + 1;
        }
      },
      error: () => {
        this.sending = false;
      },
    });
  }

  removeComment(commentId: string) {
    this.comments = this.comments.filter((c) => c._id !== commentId);
    if (this.post) {
      this.post.commentsCount = Math.max(0, this.post.commentsCount - 1);
    }
  }

  
  onPostDeleted() {
    this.router.navigate(['/']);
  }
}