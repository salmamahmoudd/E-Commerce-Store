import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interface/cart';
import { ToastService } from './toast.service';
import { IProduct } from '../interface/product';
import { AuthService } from './auth';
import { ProductService } from './product';
@Injectable({
  providedIn: 'root',
})
export class CartService {
constructor(private toast: ToastService, private authService: AuthService, private productService: ProductService) {
  this.authService.currentUser.subscribe(user => {
    if (user && user.role === 'user') {
      this.loadCart();
    }
  });
}

  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItems.asObservable();
loadCart() {
  const user = this.authService.getUser();

  if (!user || user.role !== 'user') {
    this.cartItems.next([]);
    return;
  }

  const key = `cart_${user.id}`;
  const stored = localStorage.getItem(key);
  this.cartItems.next(stored ? JSON.parse(stored) : []);
}

private saveToStorage(items: CartItem[]) {
  const user = this.authService.getUser();
  if (!user) return;

  const key = `cart_${user.id}`;

  if (items.length > 0) {
    localStorage.setItem(key, JSON.stringify(items));
  } else {
    localStorage.removeItem(key);
  }

  this.cartItems.next(items);
}


  addToCart(product: IProduct) {
    const user = this.authService.getUser();
    if (!user) {
      this.toast.show('You must be logged in to add items to the cart', 'error');
      return;
    }

    const key = `cart_${user.id}`;
    const cart: CartItem[] = JSON.parse(localStorage.getItem(key) || '[]');

    const cartItem: CartItem = {
      _id: product._id!,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || '',
      stock: product.stock 
    };

    const existing = cart.find(i => i._id === cartItem._id);
    if (existing) {
      existing.quantity++;
      this.toast.show('Quantity increased 🛒', 'success');
    } else {
      cart.push(cartItem);
      this.toast.show('Added to cart ✔', 'success');
    }

    this.saveToStorage(cart);

  }

  syncPricesWithBackend() {
  const items = [...this.cartItems.value];

items.forEach(item => {
  this.productService.getProduct(item._id).subscribe(p => {
    if (p.price !== item.price) {
      item.price = p.price;
      this.toast.show(`Price has been updated for ${p.name}`, 'success');
    }

    item.stock = p.stock;

    if (item.stock === 0) {
      this.toast.show(`${p.name} is out of stock ❌`, 'error');
    }
  });
});

}


  getCartCount(): number {
    const user = this.authService.getUser();
    if (!user) return 0;
    const cart: CartItem[] = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  increaseQuantity(id: string) {
    const items = [...this.cartItems.value];
    const item = items.find(i => i._id === id);
    if (item) item.quantity++;
    this.saveToStorage(items);
  }

  decreaseQuantity(id: string) {
    let items = [...this.cartItems.value];
    const item = items.find(i => i._id === id);

    if (!item) return;

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      items = items.filter(i => i._id !== id);
    }

    this.saveToStorage(items);
  }

  removeFromCart(id: string) {
    const items = this.cartItems.value.filter(i => i._id !== id);
    this.saveToStorage(items);
  }

  clearCart() {
    this.saveToStorage([]);
  }

  getTotal(): number {
    return this.cartItems.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }




}

