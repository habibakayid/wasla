import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { PostsService } from '@core/services/posts.service';
import { Post } from '@core/models/post.model';
import { CreatePostComponent } from '../../components/create-post/create-post.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { WhoToFollowComponent } from '../../components/who-to-follow/who-to-follow.component';

@Component({
  selector: 'app-feed',
  imports: [NgFor, NgIf, NgClass, WhoToFollowComponent, CreatePostComponent, PostCardComponent],
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  filter = 'all';
  page = 1;
  limit = 10;
  loading = false;
  hasMore = true;

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Following', value: 'following' },
    { label: 'Me', value: 'me' },
  ];

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.loadPosts();
  }

  changeFilter(value: string) {
    this.filter = value;
    this.refresh();
  }


  refresh() {
    this.page = 1;
    this.posts = [];
    this.hasMore = true;
    this.loading = false;
    this.loadPosts();
  }

  loadPosts() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.postsService.getFeed(this.filter, this.page, this.limit).subscribe({
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