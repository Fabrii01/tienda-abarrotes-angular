import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'; 
import { FavoritesPageComponent } from './pages/favorites-page/favorites-page.component'; 
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'carrito', component: CartPageComponent },
  
  // 1. Mueve el login AQUÍ (antes del comodín)
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'perfil', component: ProfilePageComponent },
  { path: 'favoritos', component: FavoritesPageComponent },

  // 2. El comodín SIEMPRE va al final
  { path: '**', redirectTo: '' }
];