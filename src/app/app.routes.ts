import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'; 
import { FavoritesPageComponent } from './pages/favorites-page/favorites-page.component'; 
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { MyPurchasesPageComponent } from './pages/my-purchases-page/my-purchases-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'producto/:slug', component: ProductDetailPageComponent },
  { path: 'carrito', component: CartPageComponent },
  { path: 'checkout', component: CheckoutPageComponent },
  { path: 'mis-compras', component: MyPurchasesPageComponent },
  
  // 1. Mueve el login AQUÍ (antes del comodín)
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'perfil', component: ProfilePageComponent },
  { path: 'favoritos', component: FavoritesPageComponent },

  // 2. El comodín SIEMPRE va al final
  { path: '**', redirectTo: '' }
];