import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component'; // IMPORTANTE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent], // AGREGARLO
  template: `
    <app-navbar></app-navbar>
    
    <app-sidebar></app-sidebar> 

    <router-outlet></router-outlet>

    <footer class="bg-dark text-white text-center py-4 mt-5">
      <p class="mb-0">© 2025 MiEmpresa - Proyecto Angular</p>
    </footer>
  `
})
export class AppComponent {}