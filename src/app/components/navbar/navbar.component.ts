import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2" style="z-index: 1000;">
      <div class="container-fluid px-3 px-lg-5">
        
        <div class="d-flex align-items-center gap-2">
             <button class="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center hover-bg-gray border-0" 
                     style="width: 40px; height: 40px;" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuFatahi">
               <i class="bi bi-list fs-4"></i>
             </button>
             
             <a class="navbar-brand fw-bold text-dark fs-3 cursor-pointer m-0 ms-1 tracking-tight" (click)="irAlInicio()">
               Fatahi<span class="text-success" style="font-size: 0.5em;"><i class="bi bi-shop ms-1"></i></span>
             </a>
        </div>

        <div class="flex-grow-1 px-3 d-none d-md-block mx-auto animate-fade-in" style="max-width: 600px;" *ngIf="router.url === '/'">
          <div class="input-group">
            <span class="input-group-text bg-light border-0 rounded-start-pill ps-3 text-muted">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-light rounded-end-pill py-2 shadow-none" 
                   placeholder="Buscar en el catálogo..." (input)="buscar($event)" [value]="storeService.terminoBusqueda()">
          </div>
        </div>

        <div class="d-flex align-items-center gap-1 ms-auto">
          <a *ngIf="authService.currentUserProfile()?.role === 'admin'" 
             routerLink="/admin" class="btn btn-dark rounded-pill fw-bold px-4 shadow-sm">
             <i class="bi bi-shield-lock-fill me-2"></i>Panel Admin
          </a>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    .tracking-tight { letter-spacing: -0.5px; }
    .hover-bg-gray:hover { background-color: #f3f4f6; }
    input:focus { background-color: white !important; box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2); }
  `]
})
export class NavbarComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  router = inject(Router);

  buscar(event: any) { this.storeService.buscarProducto(event.target.value); }
  irAlInicio() { this.storeService.resetearFiltros(); this.router.navigate(['/']); }
}