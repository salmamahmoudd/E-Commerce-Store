import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthNavbar } from "../../auth-navbar/auth-navbar";
import { Navbar } from "../../shared/navbar/navbar";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
 imports: [FormsModule, Navbar, AuthNavbar, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  productForm!: FormGroup;  
  message = '';

  constructor(private http: HttpClient, private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required],
      category: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  handleFile(event: any) {
    this.productForm.patchValue({ image: event.target.files[0] });
  }

  addProduct() {
    if (this.productForm.invalid) {
      this.message = 'All fields are required';
      return;
    }

    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    const token = this.auth.getToken();

    this.http.post('http://localhost:3000/products/add', formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.message = 'Product added successfully';
        this.productForm.reset();
      },
      error: (err) => this.message = err.error.message
    });
  }
}
