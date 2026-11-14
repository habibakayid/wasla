import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config';
import { formThenJson } from '../utils/body-fallback';

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
    return formThenJson(
      (context) => this.http.post<any>(API_URL + '/posts/' + postId + '/comments', formData, { context }),
      () => this.http.post<any>(API_URL + '/posts/' + postId + '/comments', { content: content }),
    );
  }

  updateComment(postId: string, commentId: string, content: string) {
    const url = API_URL + '/posts/' + postId + '/comments/' + commentId;
    const formData = new FormData();
    formData.append('content', content);
    return formThenJson(
      (context) => this.http.put<any>(url, { content: content }, { context }),
      () => this.http.put<any>(url, formData),
    );
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
    const url = API_URL + '/posts/' + postId + '/comments/' + commentId + '/replies';
    return formThenJson(
      (context) => this.http.post<any>(url, formData, { context }),
      () => this.http.post<any>(url, { content: content }),
    );
  }
}