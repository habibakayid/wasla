import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  
  getFeed(only: string, page: number, limit: number) {
    return this.http.get<any>(API_URL + '/posts/feed?only=' + only + '&page=' + page + '&limit=' + limit);
  }

  
  getAllPosts(page: number, limit: number) {
    return this.http.get<any>(API_URL + '/posts?page=' + page + '&limit=' + limit);
  }

  getPost(postId: string) {
    return this.http.get<any>(API_URL + '/posts/' + postId);
  }

  
  createPost(body: string, image: File | null, privacy: string) {
    const formData = new FormData();
    formData.append('body', body);
    formData.append('privacy', privacy);
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<any>(API_URL + '/posts', formData);
  }

  updatePost(postId: string, body: string) {
    const formData = new FormData();
    formData.append('body', body);
    return this.http.put<any>(API_URL + '/posts/' + postId, formData);
  }

  deletePost(postId: string) {
    return this.http.delete<any>(API_URL + '/posts/' + postId);
  }

  toggleLike(postId: string) {
    return this.http.put<any>(API_URL + '/posts/' + postId + '/like', {});
  }

  toggleBookmark(postId: string) {
    return this.http.put<any>(API_URL + '/posts/' + postId + '/bookmark', {});
  }

  sharePost(postId: string) {
    return this.http.post<any>(API_URL + '/posts/' + postId + '/share', {});
  }
}