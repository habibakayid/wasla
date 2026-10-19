import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private http: HttpClient) {}

  getComments(postId: string, page: number, limit: number) {
    return this.http.get<any>(API_URL + '/posts/' + postId + '/comments?page=' + page + '&limit=' + limit);
  }

  
  createComment(postId: string, content: string, image: File | null) {
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<any>(API_URL + '/posts/' + postId + '/comments', formData);
  }

  
  updateComment(postId: string, commentId: string, content: string) {
    return this.http.put<any>(API_URL + '/posts/' + postId + '/comments/' + commentId, { content: content });
  }

  deleteComment(postId: string, commentId: string) {
    return this.http.delete<any>(API_URL + '/posts/' + postId + '/comments/' + commentId);
  }

  toggleLike(postId: string, commentId: string) {
    return this.http.put<any>(API_URL + '/posts/' + postId + '/comments/' + commentId + '/like', {});
  }

  getReplies(postId: string, commentId: string, page: number, limit: number) {
    return this.http.get<any>(
      API_URL + '/posts/' + postId + '/comments/' + commentId + '/replies?page=' + page + '&limit=' + limit
    );
  }

  createReply(postId: string, commentId: string, content: string) {
    const formData = new FormData();
    formData.append('content', content);
    return this.http.post<any>(API_URL + '/posts/' + postId + '/comments/' + commentId + '/replies', formData);
  }
}