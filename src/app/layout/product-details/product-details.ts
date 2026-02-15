import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { IProduct, IReview } from '../../interface/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from "../../shared/footer/footer";
import { Navbar } from "../../shared/navbar/navbar";
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule, Footer, Navbar],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartService = inject(CartService);


  product: IProduct | null = null;
  selectedImage = '';
  imagesArray: string[] = [];

  newReviewUser = '';
  newReviewComment = '';
  newReviewRating = 0;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe(res => {
      this.product = res;

      if (Array.isArray(res.image)) {
        this.imagesArray = res.image;
      } else if (res.image) {
        this.imagesArray = [res.image];
      }

      this.selectedImage = this.imagesArray[0] || '';
    });
  }

  starsArray(rating: number = 0) {
    return [1, 2, 3, 4, 5].map(star => star <= Math.round(rating));
  }
  addToCart(product: any) {
  this.cartService.addToCart(product);
}
addReview() {
  if (!this.product) return;

  const review = {
    user: this.newReviewUser,
    comment: this.newReviewComment,
    rating: this.newReviewRating
  };

  this.productService
    .addReview(this.product._id!, review)
    .subscribe(res => {
      this.product = res;

      this.newReviewUser = '';
      this.newReviewComment = '';
      this.newReviewRating = 0;
    });
}

}
