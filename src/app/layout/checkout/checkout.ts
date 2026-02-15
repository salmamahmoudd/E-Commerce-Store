import { CartItem } from '../../interface/cart';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast.service';
import { Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateOrder, Order } from '../../interface/order';
import { OrderService } from '../../services/order';
import { Footer } from "../../shared/footer/footer";
import { Navbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule, Footer, Navbar],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  name = '';
  address = '';
  phone = '';
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private toast: ToastService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

hasOutOfStock(): boolean {
  return this.cartItems.some(item => item.stock === 0 || item.quantity > item.stock);
}


placeOrder() {
  if (this.cartItems.length === 0) {
    this.toast.show('Cart is empty ❌', 'error');
    return;
  }

  if (!this.name || !this.address || !this.phone) {
    this.toast.show('Please fill all fields ❌', 'error');
    return;
  }

  const order: CreateOrder = {
    items: this.cartItems.map(item => ({
      productId: item._id,
      quantity: item.quantity,
      priceAtAdd: item.price
    })),
    total: this.cartService.getTotal(),
    name: this.name,
    address: this.address, 
    phone: this.phone,
    paymentMethod: 'cash'
  };

  this.orderService.createOrder(order).subscribe({
    next: () => {
      this.toast.show('Order placed successfully 🎉', 'success');
      this.cartService.clearCart();
      this.router.navigate(['/']);
    },
   error: (err) => {
  if (err.error?.message?.includes('Price changed')) {
    this.toast.show('Price has been updated ❗ Please review your cart.', 'error');
  } else {
    this.toast.show('Failed to place order ❌', 'error');
  }
}
  });
}


  get total() {
    return this.cartService.getTotal();
  }
}