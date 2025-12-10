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
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2 sticky-top shadow-sm" style="height: 70px;">
      <div class="container-fluid px-4">
        
        <div class="d-flex align-items-center gap-3">
             <button class="btn btn-outline-dark border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuFalabella">
               <i class="bi bi-list fs-4"></i>
             </button>
             
             <a class="navbar-brand fw-bold text-success fs-4 cursor-pointer" (click)="irAlInicio()">
               Abarrotes<span class="text-dark small">.com</span>
             </a>
        </div>

        <div class="flex-grow-1 px-3 d-none d-md-block">
          <div class="input-group">
            <input type="text" 
                   class="form-control rounded-pill border-end-0 ps-4 bg-light" 
                   placeholder="Buscar producto..." 
                   (input)="buscar($event)"
                   [value]="storeService.terminoBusqueda()">
            <span class="input-group-text bg-light border-start-0 rounded-pill pe-3">
              <i class="bi bi-search text-muted"></i>
            </span>
          </div>
        </div>

        <div class="d-flex align-items-center gap-3">
          
          <div *ngIf="!authService.currentUserProfile()" 
               class="d-none d-lg-flex flex-column align-items-center text-muted small cursor-pointer"
               routerLink="/login">
            <span class="text-muted">Hola,</span>
            <span class="fw-bold text-dark">Inicia sesión</span>
          </div>

          <div *ngIf="authService.currentUserProfile()" class="d-none d-lg-flex flex-column align-items-center small cursor-pointer dropdown">
            <span class="text-muted">Hola,</span>
            
            <span class="fw-bold text-success dropdown-toggle" data-bs-toggle="dropdown">
              {{ obtenerNombreBonito() }}
            </span>
            
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><span class="dropdown-item-text text-muted small">{{ authService.currentUser()?.email }}</span></li>
              <li><hr class="dropdown-divider"></li>
              
              <li *ngIf="authService.currentUserProfile()?.role === 'admin'">
                <a class="dropdown-item fw-bold text-primary" routerLink="/admin">
                  <i class="bi bi-speedometer2 me-2"></i>Panel Admin
                </a>
              </li>

              <li><a class="dropdown-item" routerLink="/perfil">Mi Perfil</a></li>
              
              <li><a class="dropdown-item" href="#">Mis Compras</a></li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger fw-bold" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>

          <a routerLink="/favoritos" class="text-dark fs-5 cursor-pointer position-relative">
            <i class="bi bi-heart"></i>
            <span *ngIf="storeService.favoritos().length > 0" 
                  class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            </span>
          </a>
          
          <a routerLink="/carrito" class="text-dark position-relative fs-5 cursor-pointer">
            <i class="bi bi-cart3"></i>
            <span *ngIf="storeService.carrito().length > 0" 
                  class="badge rounded-pill bg-success position-absolute top-0 start-100 translate-middle" 
                  style="font-size: 0.6rem;">
              {{ storeService.carrito().length }}
            </span>
          </a>

        </div>
      </div>
    </nav>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    input:focus { box-shadow: none; border-color: #ced4da; } 
  `]
})
export class NavbarComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  router = inject(Router);

  buscar(event: any) {
    this.storeService.buscarProducto(event.target.value);
  }

  irAlInicio() {
    this.storeService.resetearFiltros();
    this.router.navigate(['/']);
  }

  obtenerNombreBonito() {
    const perfil = this.authService.currentUserProfile();
    if (perfil) {
      const primerNombre = perfil.nombre.split(' ')[0];
      const primerApellido = perfil.apellidos.split(' ')[0];
      return `${primerNombre} ${primerApellido}`;
    }
    return 'Mi Cuenta';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}