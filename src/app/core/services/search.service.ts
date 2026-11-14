import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, tap } from 'rxjs';

import { PostsService } from './posts.service';
import { UsersService } from './users.service';
import { Post } from '../models/post.model';

export interface SearchResult {
  people: any[];
  posts: Post[];
}


@Injectable({ providedIn: 'root' })
export class SearchService {
  private cache: { time: number; posts: Post[]; suggested: any[] } | null = null;

  private pages = 5;
  private limit = 20;

  constructor(
    private postsService: PostsService,
    private usersService: UsersService
  ) {}

  private load(): Observable<{ posts: Post[]; suggested: any[] }> {
    if (this.cache && Date.now() - this.cache.time < 2 * 60 * 1000) {
      return of(this.cache);
    }

    const requests: Observable<any>[] = [];
    for (let page = 1; page <= this.pages; page++) {
      requests.push(this.postsService.getAllPosts(page, this.limit).pipe(catchError(() => of(null))));
    }
    const suggestions = this.usersService.getSuggestions(30).pipe(catchError(() => of(null)));

    return forkJoin([forkJoin(requests), suggestions]).pipe(
      map(([pageResults, sug]) => {
        const posts: Post[] = [];
        const seen = new Set<string>();
        for (const res of pageResults) {
          const list: Post[] = (res && res.data && res.data.posts) || [];
          for (const post of list) {
            if (!seen.has(post._id)) {
              seen.add(post._id);
              posts.push(post);
            }
          }
        }

        let suggested: any[] = [];
        if (sug && sug.data) {
          suggested = Array.isArray(sug.data) ? sug.data : sug.data.suggestions || sug.data.users || [];
        }
        return { time: Date.now(), posts: posts, suggested: suggested };
      }),
      tap((data) => (this.cache = data))
    );
  }

  search(query: string): Observable<SearchResult> {
    
    const q = query.trim().toLowerCase().replace(/^[@#]/, '');

    return this.load().pipe(
      map((data) => {
        const posts = data.posts.filter((post) => {
          const text = [
            post.body,
            post.user && post.user.name,
            post.user && post.user.username,
            post.sharedPost && post.sharedPost.body,
          ]
            .join(' ')
            .toLowerCase();
          return text.includes(q);
        });

       
        const everyone = new Map<string, any>();
        for (const user of data.suggested) {
          everyone.set(user._id, user);
        }
        for (const post of data.posts) {
          if (post.user && !everyone.has(post.user._id)) {
            everyone.set(post.user._id, post.user);
          }
          const original = post.sharedPost;
          if (original && original.user && !everyone.has(original.user._id)) {
            everyone.set(original.user._id, original.user);
          }
        }

        const people = Array.from(everyone.values()).filter((user) =>
          ((user.name || '') + ' ' + (user.username || '')).toLowerCase().includes(q)
        );

        return { people: people, posts: posts };
      })
    );
  }
}