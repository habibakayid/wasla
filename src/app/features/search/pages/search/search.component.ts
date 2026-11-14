import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SearchService } from '@core/services/search.service';
import { Post } from '@core/models/post.model';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';
import { UserRowComponent } from '@shared/components/user-row/user-row.component';
import { PostCardComponent } from '@features/feed/components/post-card/post-card.component';


@Component({
  selector: 'app-search',
  imports: [NgIf, NgFor, NgClass, TranslatePipe, InfiniteScrollDirective, UserRowComponent, PostCardComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  term = signal(''); 
  tab = signal('all'); 
  loading = signal(false);
  people = signal<any[]>([]);
  posts = signal<Post[]>([]);


  visibleCount = signal(10);
  visiblePosts = computed(() => this.posts().slice(0, this.visibleCount()));
  hasMorePosts = computed(() => this.visibleCount() < this.posts().length);

 
  shownPeople = computed(() => (this.tab() === 'all' ? this.people().slice(0, 5) : this.people()));

  private sub: Subscription | null = null;
  private timer: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const q = (params.get('q') || '').trim();
      this.term.set(q);
      this.run(q);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    clearTimeout(this.timer);
  }

  private run(q: string) {
    if (this.sub) {
      this.sub.unsubscribe(); 
    }
    this.visibleCount.set(10);

    if (q === '') {
      this.people.set([]);
      this.posts.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.sub = this.searchService.search(q).subscribe({
      next: (result) => {
        this.people.set(result.people);
        this.posts.set(result.posts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  
  onType(value: string) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.router.navigate(['/search'], { queryParams: value.trim() ? { q: value.trim() } : {}, replaceUrl: true });
    }, 400);
  }

  showMorePosts() {
    this.visibleCount.update((n) => n + 10);
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