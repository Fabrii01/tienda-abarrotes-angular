import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Necesario para *ngIf
import { RouterOutlet, Router } from '@angular/router'; // <--- Necesario para detectar la ruta
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FloatingWhatsappComponent } from './components/floating-whatsapp/floating-whatsapp.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, FloatingWhatsappComponent], // <--- Agregamos CommonModule
  template: `
    <app-navbar></app-navbar>
    
    <app-sidebar *ngIf="!esRutaAdmin()"></app-sidebar> 

    <router-outlet></router-outlet>

    <app-floating-whatsapp></app-floating-whatsapp>

    <footer class="bg-dark text-white text-center py-4 mt-5">
      <p class="mb-0">© 2025 Abarrotes.com</p>
    </footer>
  `
})
export class AppComponent {
  // Inyectamos el Router para saber en qué página estamos
  private router = inject(Router);

  // Función que devuelve TRUE si estamos en el panel de admin
  esRutaAdmin(): boolean {
    return this.router.url.includes('/admin');
  }
}