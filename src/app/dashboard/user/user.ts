import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../interface/user';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user',
  imports: [CommonModule,FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {

  users: IUser[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: res => {
        this.users = res;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  toggleBlock(user: IUser) {
    if(user.isBlocked) {
      this.userService.unblockUser(user._id).subscribe(() => this.loadUsers());
    } else {
      this.userService.blockUser(user._id).subscribe(() => this.loadUsers());
    }
  }

  filteredUsers() {
    if(!this.searchTerm) return this.users;
    return this.users.filter(u => 
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
