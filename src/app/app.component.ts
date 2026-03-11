import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet, Router, RouterLink } from '@angular/router'; // <--- IMPORTANTE: Agregado RouterLink
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FloatingWhatsappComponent } from './components/floating-whatsapp/floating-whatsapp.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavbarComponent, SidebarComponent, FloatingWhatsappComponent], // <--- Agregado RouterLink
  template: `
    <app-navbar *ngIf="!esRutaAdmin() && !esRutaLogin()"></app-navbar>
    
    <app-sidebar *ngIf="!esRutaAdmin() && !esRutaLogin()"></app-sidebar> 

    <router-outlet></router-outlet>

    <app-floating-whatsapp *ngIf="!esRutaAdmin() && !esRutaLogin()"></app-floating-whatsapp>

    <footer class="bg-dark text-white text-center py-4 mt-auto" *ngIf="!esRutaAdmin() && !esRutaLogin()">
      <div class="container d-flex flex-column align-items-center">
        
        <div class="d-flex align-items-center justify-content-center">
          <p class="mb-0 fw-bold">© 2026 Fatahi.</p>
          
          <a routerLink="/login" class="text-white-50 ms-2" style="opacity: 0.2; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='0.2'" title="Acceso Admin">
            <i class="bi bi-lock-fill" style="font-size: 0.9rem;"></i>
          </a>
        </div>
        
        <small class="text-white-50 mt-1">Hecho con ❤️ para ti</small>
      </div>
    </footer>
  `
})
export class AppComponent {
  private router = inject(Router);

  // Función que devuelve TRUE si estamos en el panel de admin
  esRutaAdmin(): boolean {
    return this.router.url.includes('/admin');
  }

  // Función que devuelve TRUE si estamos en la pantalla de login
  esRutaLogin(): boolean {
    return this.router.url.includes('/login');
  }
}