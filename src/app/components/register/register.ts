import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { AuthNavbar } from '../../auth-navbar/auth-navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AuthNavbar, Footer,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repassword: ['', [Validators.required]],
    }, { validators: this.passwordMatch });
  }

  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const repass = group.get('repassword')?.value;
    return pass === repass ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.invalid) return;

    this.auth.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error.message;
      }
    });
  }
}