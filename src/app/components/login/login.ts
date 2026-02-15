import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthNavbar } from '../../auth-navbar/auth-navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, AuthNavbar, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
loginForm!: FormGroup;
error = '';


constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

ngOnInit() {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}


  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

this.auth.login({
  email: this.email!.value!,
  password: this.password!.value!
})      .subscribe({
        next: res => {
          this.auth.saveToken(res.token);
          this.auth.saveUser(res.user);
          this.router.navigate(['/home']);
        },
        error: err => {
          this.error = err.error.message || 'Login failed';
        }
      });
  }
}

