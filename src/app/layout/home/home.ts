import { CartService } from './../../services/cart';
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { IProduct } from '../../interface/product';
import { ICategory } from '../../interface/category';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { SubcategoryService } from '../../services/subcategory';
import { ISubCategory } from '../../interface/subcategory';
import { RouterLink } from '@angular/router';
import { Navbar } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { TestimnialService } from '../../services/testimnial';
import { ITestimonial } from '../../interface/testimnial';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
 productService = inject(ProductService);
  categoryService = inject(CategoryService);
  subCategoryService = inject(SubcategoryService);
  cartService =inject(CartService);
  testimonialService = inject(TestimnialService)

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  categories: ICategory[] = [];
  subCategories: ISubCategory[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedSubCategory: string = '';
  sortPriceOrder: string = '';
  genderFilter: string = '';
  currentPage = 1;
  itemsPerPage = 15;
  featuredProducts: IProduct[] = [];
  testimonials: any[] = [];
  newTestimonial: ITestimonial = { comment: '', rating: 0 };
testimonialMessage = '';
testimonialSuccess = false;


ngOnInit() {
  this.loadProducts();
  this.loadCategories();
  this.loadTestimonials();

  this.productService.getFeaturedProducts().subscribe({
    next: (data) => this.featuredProducts = data,
    error: (err) => console.log(err)
  });
}


  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filterProducts();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  loadTestimonials() {
  this.testimonialService.getApprovedTestimonials().subscribe(data => this.testimonials = data);
}

  onCategoryChange() {
    if (!this.selectedCategory) {
      this.subCategories = [];
      this.selectedSubCategory = '';
      this.filterProducts();
      return;
    }
    this.subCategoryService.getSubCategoriesByCategory(this.selectedCategory).subscribe(data => {
      this.subCategories = data;
      this.selectedSubCategory = '';
      this.filterProducts();
    });
  }

  filterProducts() {
    let temp = [...this.products];

    if (this.searchTerm) {
      temp = temp.filter(p => p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    if (this.selectedCategory) {
      temp = temp.filter(p => typeof p.category === 'string' ? p.category === this.selectedCategory : p.category._id === this.selectedCategory);
    }

    if (this.selectedSubCategory) {
      temp = temp.filter(p => typeof p.subcategory === 'string' ? p.subcategory === this.selectedSubCategory : p.subcategory?._id === this.selectedSubCategory);
    }

    if (this.genderFilter) {
      temp = temp.filter(p => (p as any).gender === this.genderFilter);
    }

    if (this.sortPriceOrder === 'asc') {
      temp.sort((a,b) => a.price - b.price);
    } else if (this.sortPriceOrder === 'desc') {
      temp.sort((a,b) => b.price - a.price);
    }

    this.filteredProducts = temp;
    this.currentPage = 1; 
  }

  submitTestimonial() {
  if (!this.newTestimonial.comment || !this.newTestimonial.rating) return;

  this.testimonialService.addTestimonial(this.newTestimonial).subscribe({
    next: (res) => {
      this.testimonialMessage = 'Your testimonial has been submitted for approval!';
      this.testimonialSuccess = true;
      this.newTestimonial = { comment: '', rating: 0 };
    },
    error: (err) => {
      this.testimonialMessage = 'Failed to submit testimonial.';
      this.testimonialSuccess = false;
    }
  });
}
  paginatedProducts(): IProduct[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    const total = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    return Array.from({length: total}, (_, i) => i + 1);
  }

  goToPage(page: number) {
  this.currentPage = page;

  const productsSection = document.getElementById('products-section');
  productsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


  starsArray(rating: number | undefined): number[] {
    const validRating = rating ?? 0;
    return [1,2,3,4,5].map(star => star <= validRating ? 1 : 0);
  }

  getCategoryName(id: string) {
    const cat = this.categories.find(c => c._id === id);
    return cat ? cat.name : '';
  }
    getSubCategoryName(id: string) {
    const sub = this.subCategories.find(s => s._id === id);
    return sub ? sub.name : '';
  }
  checkPrice(product: IProduct) {
  this.productService.getProduct(product._id!).subscribe(latest => {
    if (latest.price !== product.price) {
      alert(`Price changed from $${product.price} to $${latest.price}`);
      product.price = latest.price;
    }
  });
}

  addToCart(product: IProduct) {
  this.cartService.addToCart(product);
}

}

