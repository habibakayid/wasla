import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PostsService } from '@core/services/posts.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';
import { UserRowComponent } from '@shared/components/user-row/user-row.component';


@Component({
  selector: 'app-post-likes',
  imports: [NgIf, NgFor, RouterLink, TranslatePipe, InfiniteScrollDirective, UserRowComponent],
  templateUrl: './post-likes.component.html',
})
export class PostLikesComponent implements OnInit {
  postId = '';
  users = signal<any[]>([]);
  total = signal(0);
  loading = signal(false);
  hasMore = signal(true);

  page = 1;
  limit = 20;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.load();
  }

  load() {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);

    this.postsService.getLikes(this.postId, this.page, this.limit).subscribe({
      next: (res) => {
        
        const d = res.data;
        const raw: any[] = Array.isArray(d) ? d : (d && (d.likes || d.users || d.items)) || [];
        const list = raw.map((item) => item.user || item.likedBy || item).filter((u) => u && u._id);

        this.users.update((old) => old.concat(list));

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore.set(pagination.currentPage < pagination.numberOfPages);
          this.total.set(pagination.total);
        } else {
          this.hasMore.set(raw.length === this.limit);
          this.total.set(this.users().length);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.hasMore.set(false);
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.load();
  }

  trackById(index: number, item: { _id: string }) {
    return item._id;
  }
}