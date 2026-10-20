import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { AuthService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';
import { Post } from '@core/models/post.model';
import { PostCardComponent } from '@features/feed/components/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  imports: [NgIf, NgFor, NgClass, RouterLink, PostCardComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('weekChart');
  chart: any = null;

  activeTab = signal('analytics'); 

  profile = signal<any>(null);
  myPosts = signal<Post[]>([]);
  savedPosts = signal<Post[]>([]);
  loadingPosts = signal(true);
  loadingSaved = signal(false);

  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

 
  cards = computed(() => {
    let likes = 0;
    let comments = 0;
    let shares = 0;

    for (const post of this.myPosts()) {
      likes = likes + (post.likesCount || 0);
      comments = comments + (post.commentsCount || 0);
      shares = shares + (post.sharesCount || 0);
    }

    const total = likes + comments + shares;

    return [
      { name: 'Likes', value: likes, pct: this.percent(likes, total), color: '#e11d48', text: 'text-rose-300' },
      { name: 'Comments', value: comments, pct: this.percent(comments, total), color: '#38bdf8', text: 'text-sky-300' },
      { name: 'Shares', value: shares, pct: this.percent(shares, total), color: '#a78bfa', text: 'text-violet-300' },
    ];
  });

  constructor(
    public auth: AuthService,
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {
   
    effect(() => {
      this.myPosts();
      this.updateChart();
    });
  }

  ngOnInit() {
   
    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab');
      if (tab === 'saved' || tab === 'posts' || tab === 'analytics') {
        this.activeTab.set(tab);
      }
    });

    this.usersService.getMyProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data.user || res.data); // شكل الـ data تخمين
      },
    });

    const me = this.auth.user();
    if (me) {
      this.usersService.getUserPosts(me._id).subscribe({
        next: (res) => {
          this.myPosts.set(res.data.posts || []);
          this.loadingPosts.set(false);
        },
        error: () => {
          this.loadingPosts.set(false);
        },
      });
    }

    this.loadSaved();
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.chartCanvas().nativeElement, {
      type: 'line',
      data: {
        labels: this.days,
        datasets: [
          { label: 'Likes', data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#e11d48', tension: 0.4 },
          { label: 'Comments', data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#38bdf8', tension: 0.4 },
          { label: 'Shares', data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#a78bfa', tension: 0.4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#d6d3d1' } } },
        scales: {
          x: { ticks: { color: '#a8a29e' }, grid: { color: '#2e2629' } },
          y: { ticks: { color: '#a8a29e', precision: 0 }, grid: { color: '#2e2629' }, beginAtZero: true },
        },
      },
    });
   
    this.updateChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  openTab(tab: string) {
    this.activeTab.set(tab);
  }

  loadSaved() {
    this.loadingSaved.set(true);
    this.usersService.getBookmarks().subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.savedPosts.set(res.data);
        } else {
          this.savedPosts.set(res.data.bookmarks || res.data.posts || []);
        }
        this.loadingSaved.set(false);
      },
      error: () => {
        this.loadingSaved.set(false);
      },
    });
  }

  trackById(index: number, item: { _id: string }) {
    return item._id;
  }

 
  replaceMyPost(updated: Post) {
    this.myPosts.update((list) => list.map((p) => (p._id === updated._id ? updated : p)));
  }

  removePost(postId: string) {
    this.myPosts.update((list) => list.filter((p) => p._id !== postId));
  }

 
  replaceSaved(updated: Post) {
    if (!updated.bookmarked) {
      this.savedPosts.update((list) => list.filter((p) => p._id !== updated._id));
    } else {
      this.savedPosts.update((list) => list.map((p) => (p._id === updated._id ? updated : p)));
    }
  }

 
  removeSaved(postId: string) {
    this.savedPosts.update((list) => list.filter((p) => p._id !== postId));
  }

  percent(part: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return Math.round((part / total) * 100);
  }

 
  ringDash(pct: number): string {
    const filled = (pct / 100) * 175.9;
    return filled + ' 175.9';
  }

  
  updateChart() {
    if (!this.chart) {
      return;
    }

    const likes = [0, 0, 0, 0, 0, 0, 0];
    const comments = [0, 0, 0, 0, 0, 0, 0];
    const shares = [0, 0, 0, 0, 0, 0, 0];

    for (const post of this.myPosts()) {
      const day = new Date(post.createdAt).getDay(); // 0 = Sunday
      likes[day] = likes[day] + (post.likesCount || 0);
      comments[day] = comments[day] + (post.commentsCount || 0);
      shares[day] = shares[day] + (post.sharesCount || 0);
    }

    this.chart.data.datasets[0].data = likes;
    this.chart.data.datasets[1].data = comments;
    this.chart.data.datasets[2].data = shares;
    this.chart.update();
  }
}