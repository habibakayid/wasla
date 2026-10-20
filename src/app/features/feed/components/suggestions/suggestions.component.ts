import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-suggestions',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './suggestions.component.html',
})
export class SuggestionsComponent implements OnInit {
  users = signal<any[]>([]);
  loading = signal(true);

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getSuggestions(5).subscribe({
      next: (res) => {
       
        if (Array.isArray(res.data)) {
          this.users.set(res.data);
        } else {
          this.users.set(res.data.suggestions || res.data.users || []);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

 
  private setFollowed(userId: string, value: boolean) {
    this.users.update((list) => list.map((u) => (u._id === userId ? { ...u, followed: value } : u)));
  }

  follow(user: any) {
    
    const was = !!user.followed;
    this.setFollowed(user._id, !was);

    this.usersService.toggleFollow(user._id).subscribe({
      error: () => {
        this.setFollowed(user._id, was); 
      },
    });
  }
}