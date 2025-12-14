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
                     style="width: 40px; height: 40px;"
                     type="button" 
                     data-bs-toggle="offcanvas" 
                     data-bs-target="#menuFalabella">
               <i class="bi bi-list fs-4"></i>
             </button>
             
             <a class="navbar-brand fw-bold text-dark fs-4 cursor-pointer m-0 ms-1 tracking-tight" (click)="irAlInicio()">
               Abarrotes<span class="text-success">.com</span>
             </a>
        </div>

        <div class="flex-grow-1 px-3 d-none d-md-block mx-auto animate-fade-in" style="max-width: 500px;" *ngIf="router.url === '/'">
          <div class="input-group">
            <span class="input-group-text bg-light border-0 rounded-start-pill ps-3 text-muted">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" 
                   class="form-control border-0 bg-light rounded-end-pill py-2 shadow-none" 
                   placeholder="Buscar producto..." 
                   (input)="buscar($event)"
                   [value]="storeService.terminoBusqueda()">
          </div>
        </div>

        <div class="d-flex align-items-center gap-1 gap-md-2 ms-auto">
          
          <a *ngIf="authService.currentUserProfile()?.role === 'admin'" 
             routerLink="/admin" 
             class="btn btn-dark btn-sm rounded-pill fw-bold px-3 d-flex align-items-center gap-2 animate-fade-in shadow-sm">
             <i class="bi bi-shield-lock-fill"></i> 
             <span class="d-none d-md-block">Admin</span>
          </a>
          
          <a routerLink="/carrito" class="btn btn-light rounded-circle position-relative p-0 d-flex align-items-center justify-content-center hover-bg-gray text-dark" 
             style="width: 45px; height: 45px;"
             title="Mi Carrito">
            <i class="bi bi-cart3 fs-5"></i>
            <span *ngIf="storeService.carrito().length > 0" 
                  class="badge rounded-pill bg-success position-absolute top-0 start-100 translate-middle border border-light text-white" 
                  style="font-size: 0.7rem;">
              {{ storeService.carrito().length }}
            </span>
          </a>

          <div class="dropdown ms-1">
            <a class="d-flex align-items-center text-decoration-none cursor-pointer p-1 rounded-pill hover-bg-gray pe-3" 
               data-bs-toggle="dropdown" 
               aria-expanded="false">
               
               <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-6" 
                    style="width: 38px; height: 38px;">
                 <span *ngIf="obtenerIniciales()">{{ obtenerIniciales() }}</span>
                 <i *ngIf="!obtenerIniciales()" class="bi bi-person"></i>
               </div>
               
               <div class="d-none d-lg-block ms-2 lh-1 text-start">
                 <span class="d-block fw-bold small text-dark">{{ obtenerNombreBonito() || 'Cuenta' }}</span>
                 <small class="text-muted" style="font-size: 0.7rem;">{{ authService.currentUserProfile() ? 'Hola' : 'Ingresar' }}</small>
               </div>
            </a>

            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2" style="min-width: 240px;">
              
              <li *ngIf="!authService.currentUserProfile()">
                <div class="d-grid p-2">
                   <a class="btn btn-success fw-bold rounded-pill mb-2" routerLink="/login">Iniciar Sesión</a>
                   <a class="btn btn-outline-dark fw-bold rounded-pill" routerLink="/register">Registrarse</a>
                </div>
              </li>

              <div *ngIf="authService.currentUserProfile()">
                <li class="px-3 py-2">
                   <div class="fw-bold text-dark">{{ authService.currentUserProfile()?.nombre }}</div>
                   <div class="text-muted small text-truncate">{{ authService.currentUser()?.email }}</div>
                </li>
                <li><hr class="dropdown-divider"></li>
                
                <li><a class="dropdown-item rounded-2 py-2" routerLink="/perfil"><i class="bi bi-person-gear me-2"></i>Mi Perfil</a></li>
                <li><a class="dropdown-item rounded-2 py-2" routerLink="/mis-compras"><i class="bi bi-bag-check me-2"></i>Mis Compras</a></li>
                
                <li>
                  <a class="dropdown-item rounded-2 py-2 d-flex justify-content-between align-items-center" routerLink="/favoritos">
                    <span><i class="bi bi-heart me-2"></i>Favoritos</span>
                    <span *ngIf="storeService.favoritos().length > 0" class="badge bg-danger rounded-pill">{{ storeService.favoritos().length }}</span>
                  </a>
                </li>
                
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item rounded-2 py-2 text-danger fw-bold" (click)="logout()">
                    <i class="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
                  </button>
                </li>
              </div>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    .tracking-tight { letter-spacing: -0.5px; }
    .hover-bg-gray:hover { background-color: #f3f4f6; }
    .dropdown-toggle::after { display: none !important; }
    input:focus { background-color: white !important; box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2); }
  `]
})
export class NavbarComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  public router = inject(Router);

  buscar(event: any) {
    this.storeService.buscarProducto(event.target.value);
  }

  irAlInicio() {
    this.storeService.resetearFiltros();
    this.router.navigate(['/']);
  }

  obtenerNombreBonito() {
    const perfil = this.authService.currentUserProfile();
    if (perfil && perfil.nombre) {
      return perfil.nombre.split(' ')[0];
    }
    return '';
  }

  obtenerIniciales(): string {
    const perfil = this.authService.currentUserProfile();
    if (perfil && perfil.nombre) {
      return perfil.nombre.charAt(0).toUpperCase();
    }
    return ''; 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}