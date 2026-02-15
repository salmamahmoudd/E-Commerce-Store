import { Component, inject, OnInit } from '@angular/core';
import { IProduct } from '../../interface/product';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category';
import { SubcategoryService } from '../../services/subcategory';
import { ICategory } from '../../interface/category';
import { ISubCategory } from '../../interface/subcategory';
import { RouterLink } from '@angular/router';
import { Navbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule, RouterLink, Navbar],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
subCategoryService = inject(SubcategoryService);

categories: ICategory[] = [];
subCategories: ISubCategory[] = [];

  products: IProduct[] = [];
  newProduct: { name: string; description: string; price: number; category: string; subcategory?: string; stock: number } = {
    name: '', description: '', price: 0, category: '', stock: 0
  };
  selectedFile: File | null = null;
  editMode = false;
  selectedId = '';
  searchTerm = '';
currentPage = 1;
itemsPerPage = 6;

  toasts: { message: string; type: 'success' | 'error' }[] = [];


  ngOnInit() {
     this.loadProducts();
     this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  loadCategories() {
  this.categoryService.getCategories().subscribe(data => this.categories = data);
}

onCategoryChange() {
  if (!this.newProduct.category) {
    this.subCategories = [];
    return;
  }

  this.subCategoryService
    .getSubCategoriesByCategory(this.newProduct.category)
    .subscribe(data => this.subCategories = data);
}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  starsArray(rating: number | undefined): number[] {
  const validRating = rating ?? 0; 
  return [1, 2, 3, 4, 5].map(star => star <= validRating ? 1 : 0); 
}

saveProduct() {
  const formData = new FormData();
  formData.append('name', this.newProduct.name);
  formData.append('description', this.newProduct.description);
  formData.append('price', this.newProduct.price.toString());
  formData.append('category', this.newProduct.category);
  formData.append('stock', this.newProduct.stock.toString());
  if (this.newProduct.subcategory) formData.append('subcategory', this.newProduct.subcategory);
  if (this.selectedFile) formData.append('image', this.selectedFile);

  const obs = this.editMode
    ? this.productService.updateProduct(this.selectedId, formData)
    : this.productService.addProduct(formData);

  obs.subscribe({
    next: () => {
      this.resetForm();
      this.loadProducts();
      this.showToast(
        this.editMode ? 'Product updated successfully' : 'Product added successfully',
        'success'
      );
    },
    error: () => this.showToast('Operation failed', 'error')
  });
  
}


editProduct(product: IProduct) {
  this.editMode = true;
  this.selectedId = product._id!;

  this.newProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    category:
      typeof product.category === 'string'
        ? product.category
        : product.category._id,

    subcategory:
      typeof product.subcategory === 'string'
        ? product.subcategory
        : product.subcategory?._id,

    stock: product.stock
  };
}
showToast(message: string, type: 'success' | 'error') {
  const toast = { message, type };
  this.toasts.push(toast);

  setTimeout(() => {
    this.toasts = this.toasts.filter(t => t !== toast);
  }, 3000);
}


 deleteProduct(id: string) {
  this.productService.deleteProduct(id).subscribe({
    next: () => {
      this.loadProducts();
      this.showToast('Product deleted successfully', 'success');
    },
    error: () => this.showToast('Failed to delete product', 'error')
  });
}


  resetForm() {
    this.newProduct = { name: '', description: '', price: 0, category: '', stock: 0 };
    this.selectedFile = null;
    this.editMode = false;
    this.selectedId = '';
  }

  filteredProducts(): IProduct[] {
  return this.searchTerm
    ? this.products.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    : this.products;
}

paginatedProducts(): IProduct[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredProducts().slice(start, start + this.itemsPerPage);
}

totalPagesArray(): number[] {
  const total = Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  return Array.from({ length: total }, (_, i) => i + 1);
}

}
