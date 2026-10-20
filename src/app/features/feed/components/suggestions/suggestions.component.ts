import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-suggestions',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './suggestions.component.html',
})
export class SuggestionsComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getSuggestions(5).subscribe({
      next: (res) => {
        
        if (Array.isArray(res.data)) {
          this.users = res.data;
        } else {
          this.users = res.data.suggestions || res.data.users || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  follow(user: any) {
    
    user.followed = !user.followed;

    this.usersService.toggleFollow(user._id).subscribe({
      error: () => {
        user.followed = !user.followed; 
      },
    });
  }
}