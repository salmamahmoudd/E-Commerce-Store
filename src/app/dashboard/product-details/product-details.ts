import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../interface/product';
import { CommonModule, NgClass } from '@angular/common';


@Component({
  selector: 'app-product-details',
  imports: [NgClass, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
 productService = inject(ProductService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  product: IProduct | null = null;
  loading = true;
  error = '';

  toasts: { message: string; type: 'success' | 'error' }[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid product ID';
      this.loading = false;
      this.showToast('Invalid product ID', 'error');
      return;
    }

    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
        this.showToast(this.error, 'error');
      }
    });
  }

  get categoryName(): string {
    if (!this.product) return 'N/A';
    return typeof this.product.category === 'string'
      ? this.product.category
      : this.product.category?.name || 'N/A';
  }

  get subcategoryName(): string {
    if (!this.product) return 'N/A';
    return typeof this.product.subcategory === 'string'
      ? this.product.subcategory
      : this.product.subcategory?.name || 'N/A';
  }

  showToast(message: string, type: 'success' | 'error') {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 3000);
  }

  editProduct() {
    this.showToast('Edit functionality coming soon', 'success');
  }

  deleteProduct() {
    if (!this.product?._id) return;
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product._id).subscribe({
        next: () => {
          this.showToast('Product deleted successfully', 'success');
          this.router.navigate(['/admin/product']);
        },
        error: () => this.showToast('Failed to delete product', 'error')
      });
    }
  }
}
