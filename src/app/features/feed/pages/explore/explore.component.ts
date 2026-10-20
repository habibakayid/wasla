import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { PostsService } from '@core/services/posts.service';
import { Post } from '@core/models/post.model';
import { PostCardComponent } from '../../components/post-card/post-card.component';


@Component({
  selector: 'app-explore',
  imports: [NgFor, NgIf, PostCardComponent],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {
  posts: Post[] = [];
  page = 1;
  limit = 10;
  loading = false;
  hasMore = true;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.postsService.getAllPosts(this.page, this.limit).subscribe({
      next: (res) => {
        const list: Post[] = res.data.posts || [];
        this.posts = this.posts.concat(list);

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore = pagination.currentPage < pagination.numberOfPages;
        } else {
          this.hasMore = list.length === this.limit;
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.loadPosts();
  }

  removePost(postId: string) {
    this.posts = this.posts.filter((p) => p._id !== postId);
  }
}