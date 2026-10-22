import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { PostsService } from '@core/services/posts.service';
import { Post } from '@core/models/post.model';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';


@Component({
  selector: 'app-explore',
  imports: [NgFor, NgIf, PostCardComponent, TranslatePipe],
  templateUrl: './explore.component.html',
})
export class ExploreComponent implements OnInit {
  posts = signal<Post[]>([]);
  loading = signal(false);
  hasMore = signal(true);

  page = 1;
  limit = 10;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);

    this.postsService.getAllPosts(this.page, this.limit).subscribe({
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