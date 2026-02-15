import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart';
import { Router, RouterLink } from "@angular/router";
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
profilePanelOpen = false;
mobileMenuOpen = false;
cartCount = 0;
menuOpen = false;
userMenuOpen = false;
  userName: string | null = null;
  userEmail = '';
  userImage = '';
  constructor(
    private cartService: CartService,
    public toastService: ToastService,
    private authService: AuthService,
    private router:Router
  ) {}

ngOnInit() {
  const user = this.authService.getUser();
  this.userName = user?.name || null;
  this.userEmail = user?.email || '';
   this.userImage = user?.image ? `${environment.baseUrl}/uploads/${user.image}`: 'assets/user-placeholder.png';
  
  this.cartService.loadCart();

  this.cartService.cart$.subscribe(cart => {
    this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  });
}


toggleProfilePanel() {
  this.profilePanelOpen = !this.profilePanelOpen;
  this.mobileMenuOpen = false;
}

toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
  this.profilePanelOpen = false;
}
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

signOut() {
  this.authService.logout();
  this.userName = null;
  this.userEmail = '';
  this.cartService.clearCart(); 
  this.router.navigate(['/login']); 
}


}

