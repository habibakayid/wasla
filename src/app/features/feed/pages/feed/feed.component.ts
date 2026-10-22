import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { PostsService } from '@core/services/posts.service';
import { Post } from '@core/models/post.model';
import { CreatePostComponent } from '../../components/create-post/create-post.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { WhoToFollowComponent } from '../../components/who-to-follow/who-to-follow.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-feed',
  imports: [NgFor, NgIf, NgClass, WhoToFollowComponent, CreatePostComponent, PostCardComponent, TranslatePipe],
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnInit {
  posts = signal<Post[]>([]);
  filter = signal('all');
  loading = signal(false);
  hasMore = signal(true);

  page = 1;
  limit = 10;

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
    this.filter.set(value);
    this.refresh();
  }

  
  refresh() {
    this.page = 1;
    this.posts.set([]);
    this.hasMore.set(true);
    this.loading.set(false);
    this.loadPosts();
  }

  loadPosts() {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);

    this.postsService.getFeed(this.filter(), this.page, this.limit).subscribe({
      next: (res) => {
        const list: Post[] = res.data.posts || [];
        this.posts.update((old) => old.concat(list));

       
        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore.set(pagination.currentPage < pagination.numberOfPages);
        } else {
          this.hasMore.set(list.length === this.limit);
        }

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.loadPosts();
  }

  
  trackById(index: number, item: { _id: string }) {
    return item._id;
  }

 
  replacePost(updated: Post) {
    this.posts.update((list) => list.map((p) => (p._id === updated._id ? updated : p)));
  }

  removePost(postId: string) {
    this.posts.update((list) => list.filter((p) => p._id !== postId));
  }
}