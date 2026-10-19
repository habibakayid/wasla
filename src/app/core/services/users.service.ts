import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../config';


@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  signup(body: any) {
    return this.http.post<any>(API_URL + '/users/signup', body);
  }

  signin(body: any) {
    return this.http.post<any>(API_URL + '/users/signin', body);
  }

  getMyProfile() {
    return this.http.get<any>(API_URL + '/users/profile-data');
  }

  getSuggestions(limit: number) {
    return this.http.get<any>(API_URL + '/users/suggestions?page=1&limit=' + limit);
  }

  
  toggleFollow(userId: string) {
    return this.http.put<any>(API_URL + '/users/' + userId + '/follow', {});
  }

  getUserPosts(userId: string) {
    return this.http.get<any>(API_URL + '/users/' + userId + '/posts?page=1&limit=50');
  }

  getBookmarks() {
    return this.http.get<any>(API_URL + '/users/bookmarks');
  }

  
  changePassword(password: string, newPassword: string) {
    return this.http.patch<any>(API_URL + '/users/change-password', { password: password, newPassword: newPassword });
  }


  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.put<any>(API_URL + '/users/upload-photo', formData);
  }
}