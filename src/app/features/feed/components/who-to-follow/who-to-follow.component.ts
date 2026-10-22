import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

import { UsersService } from '@core/services/users.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-who-to-follow',
  imports: [NgFor, NgIf, NgClass, TranslatePipe],
  templateUrl: './who-to-follow.component.html',
})
export class WhoToFollowComponent implements OnInit {
  users = signal<any[]>([]);

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getSuggestions(8).subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.users.set(res.data);
        } else {
          this.users.set(res.data.suggestions || res.data.users || []);
        }
      },
    });
  }

  firstName(name: string): string {
    return name ? name.split(' ')[0] : '';
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