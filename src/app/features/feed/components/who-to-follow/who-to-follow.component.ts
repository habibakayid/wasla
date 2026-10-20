import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-who-to-follow',
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './who-to-follow.component.html',
})
export class WhoToFollowComponent implements OnInit {
  users: any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getSuggestions(8).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.users = res.data;
        } else {
          this.users = res.data.suggestions || res.data.users || [];
        }
      },
    });
  }

  firstName(name: string): string {
    return name ? name.split(' ')[0] : '';
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