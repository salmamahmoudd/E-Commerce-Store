import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interface/product';
import { CartItem } from '../../interface/cart';
import { ToastService } from '../../services/toast.service';
import { RouterModule } from '@angular/router';
import { Footer } from "../../shared/footer/footer";
import { Navbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, Footer, Navbar],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
cartItems: CartItem[] = [];

  constructor(private cartService: CartService,private toast:ToastService) {}

  ngOnInit() {
  this.cartService.cart$.subscribe(items => {
    this.cartItems = items;
  });

  this.cartService.syncPricesWithBackend(); 
}


  increase(id: string) {
    this.cartService.increaseQuantity(id);
  }

  decrease(id: string) {
    this.cartService.decreaseQuantity(id);
  }

  remove(id: string) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
   this.cartService.clearCart();
  this.toast.show('Cart cleared successfully 🧹');
}

  get total() {
    return this.cartService.getTotal();
  }
  
checkout() {
    if (this.cartItems.length === 0) {
      this.toast.show('Your cart is empty ❌', 'error');
      return;
    }

    this.toast.show('Proceeding to checkout 🧾', 'success');
  }
  
}
