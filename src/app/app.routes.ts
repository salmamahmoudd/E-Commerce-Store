import { Routes } from '@angular/router';
import { Home } from './layout/home/home';
import { Category } from './dashboard/category/category';
import { Subcategory } from './dashboard/subcategory/subcategory';
import { Product } from './dashboard/product/product';
import { ProductDetails } from './dashboard/product-details/product-details';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { Admin } from './dashboard/admin/admin';
import { AdminGuard } from './guards/admin.guard';
import { Cart } from './layout/cart/cart';
import { Checkout } from './layout/checkout/checkout';
import { AllOrders } from './layout/all-orders/all-orders';
import { UserGuard } from './guards/user.guard';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';
import { User } from './dashboard/user/user';
import { Profile } from './layout/profile/profile';
import { Testimonials } from './dashboard/testimonials/testimonials';
import { AllOrdersAdmin } from './dashboard/allorders/allorders';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
 { path: 'login', component: Login, canActivate: [AuthRedirectGuard] },
{ path: 'register', component: Register, canActivate: [AuthRedirectGuard] },

  {path:'profile', component:Profile, canActivate:[UserGuard]},
  { path: 'home', component: Home, canActivate: [UserGuard] },
  { path: 'cart', component: Cart, canActivate: [UserGuard] },
  { path: 'checkout', component: Checkout, canActivate: [UserGuard] },
    { path: 'product/:id', loadComponent: () =>
      import("./layout/product-details/product-details").then(m => m.ProductDetails), canActivate: [UserGuard] 
  },

  { path: 'allorders', component: AllOrders , canActivate: [UserGuard]  },

  {
    path: 'admin',
    component: Admin,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: Admin}, 
      { path: 'users', component: User },
      { path: 'category', component: Category },
      { path: 'subcategory', component: Subcategory },
      { path: 'product', component: Product },
      { path: 'product/:id', component: ProductDetails },
      { path: 'testimonials', component: Testimonials },
      { path: 'allorders', component: AllOrdersAdmin },
    ]
  },


{ path: '404', component: NotFound },
{ path: '**', redirectTo: '404' }
];

