import { Component, OnInit, computed, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';
import { Post } from '@core/models/post.model';
import { privacyOf } from '@core/utils/privacy';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';
import { PrivacyFilterComponent } from '@shared/components/privacy-filter/privacy-filter.component';
import { PostCardComponent } from '@features/feed/components/post-card/post-card.component';

@Component({
  selector: 'app-user-profile',
  imports: [NgIf, NgFor, NgClass, TranslatePipe, InfiniteScrollDirective, PrivacyFilterComponent, PostCardComponent],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  userId = '';
  user = signal<any>(null);
  loadingUser = signal(true);
  notFound = signal(false);

  following = signal(false);
  followersCount = signal(0);
  followingCount = signal(0);
  postsTotal = signal(0);

  posts = signal<Post[]>([]);
  loadingPosts = signal(false);
  hasMore = signal(true);
  privacy = signal('all');
  page = 1;
  limit = 10;

  visiblePosts = computed(() => {
    const wanted = this.privacy();
    if (wanted === 'all') {
      return this.posts();
    }
    return this.posts().filter((p) => privacyOf(p.privacy) === wanted);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';

      const me = this.auth.user();
      if (me && me._id === this.userId) {
        this.router.navigate(['/profile'], { replaceUrl: true });
        return;
      }

      this.reset();
      this.loadUser();
      this.loadPosts();
    });
  }

  private reset() {
    this.user.set(null);
    this.loadingUser.set(true);
    this.notFound.set(false);
    this.posts.set([]);
    this.hasMore.set(true);
    this.loadingPosts.set(false);
    this.privacy.set('all');
    this.page = 1;
  }

  private num(value: any): number {
    return typeof value === 'number' ? value : 0;
  }

  loadUser() {
    this.usersService.getUserProfile(this.userId).subscribe({
      next: (res) => {
        const u = (res.data && (res.data.user || res.data)) || {};
        this.user.set(u);

        const me = this.auth.user();
        const followersList: any[] = Array.isArray(u.followers) ? u.followers : [];
        this.following.set(
          !!(u.isFollowing ?? u.followed ?? u.isFollowed ?? (me && followersList.some((f) => (f._id || f) === me._id)))
        );
        this.followersCount.set(this.num(u.followersCount) || followersList.length);
        this.followingCount.set(this.num(u.followingCount) || (Array.isArray(u.following) ? u.following.length : 0));
        if (this.num(u.postsCount)) {
          this.postsTotal.set(u.postsCount);
        }
        this.loadingUser.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loadingUser.set(false);
      },
    });
  }

  loadPosts() {
    if (this.loadingPosts()) {
      return;
    }
    this.loadingPosts.set(true);

    this.usersService.getUserPosts(this.userId, this.page, this.limit).subscribe({
      next: (res) => {
        const list: Post[] = res.data.posts || [];
        this.posts.update((old) => old.concat(list));

        const pagination = res.meta && res.meta.pagination;
        if (pagination) {
          this.hasMore.set(pagination.currentPage < pagination.numberOfPages);
          if (!this.postsTotal()) {
            this.postsTotal.set(pagination.total);
          }
        } else {
          this.hasMore.set(list.length === this.limit);
        }
        this.loadingPosts.set(false);
      },
      error: () => {
        this.loadingPosts.set(false);
        this.hasMore.set(false);
      },
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.loadPosts();
  }

  toggleFollow() {
    const was = this.following();
    this.following.set(!was);
    this.followersCount.update((n) => Math.max(0, n + (was ? -1 : 1)));

    this.usersService.toggleFollow(this.userId).subscribe({
      error: () => {
        this.following.set(was);
        this.followersCount.update((n) => Math.max(0, n + (was ? 1 : -1)));
      },
    });
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