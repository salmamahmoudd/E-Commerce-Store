import { Component } from '@angular/core';
import { Footer } from "../shared/footer/footer";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-navbar',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './auth-navbar.html',
  styleUrl: './auth-navbar.css',
})
export class AuthNavbar {
menuOpen: boolean = false;
}
