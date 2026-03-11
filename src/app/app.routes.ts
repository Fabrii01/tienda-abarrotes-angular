import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'producto/:slug', component: ProductDetailPageComponent },
  
  // Rutas Admin (Ocultas al público, pero accesibles por URL)
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent },

  // Rutas Eliminadas/Desactivadas: carrito, checkout, perfil, mis-compras, favoritos.
  
  // El comodín SIEMPRE va al final
  { path: '**', redirectTo: '' }
];