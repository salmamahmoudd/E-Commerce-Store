import { Component, OnInit } from '@angular/core';
import { User } from '../../dashboard/user/user';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../interface/user';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user!: IUser;
  selectedImage!: File;
 userImage: string = '';
  constructor(private userService: UserService) {}

ngOnInit() {
  this.userService.getProfile().subscribe(res => {
    this.user = {
      ...res,
      address: res.address || { governorate: '', city: '', street: '' }
    };

    if (this.user.image) {
      this.userImage = `${environment.baseUrl}/uploads/${this.user.image}`;
    }
  });
}

  onFileChange(event: any) {
    this.selectedImage = event.target.files[0];
  }

updateProfile() {
  const formData = new FormData();
  formData.append('name', this.user.name);
  formData.append('phone', this.user.phone);

  formData.append('address', JSON.stringify({
    governorate: this.user.address.governorate,
    city: this.user.address.city,
    street: this.user.address.street
  }));

  if (this.selectedImage) {
    formData.append('image', this.selectedImage);
  }

  this.userService.updateProfile(formData).subscribe(res => {
    this.user = res.user;
    if (this.user.image) {
      this.userImage = `${environment.baseUrl}/uploads/${this.user.image}`;
    }
    alert('Profile updated successfully');
  });
}

}



