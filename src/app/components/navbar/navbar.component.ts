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
      <div class="container-fluid px-3 px-lg-4">
        
        <div class="d-flex align-items-center gap-2 gap-lg-3">
             
             <button *ngIf="!router.url.includes('/admin')" 
                     class="btn btn-outline-dark border-0 p-1" 
                     type="button" 
                     data-bs-toggle="offcanvas" 
                     data-bs-target="#menuFalabella">
               <i class="bi bi-list fs-3"></i>
             </button>
             
             <a class="navbar-brand fw-bold text-success fs-4 cursor-pointer m-0" (click)="irAlInicio()">
               Abarrotes<span class="text-dark small">.com</span>
             </a>
        </div>

        <div class="flex-grow-1 px-3 d-none d-md-block mx-auto" style="max-width: 600px;" *ngIf="router.url === '/'">
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

        <div class="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          
          <a *ngIf="authService.currentUserProfile()?.role === 'admin'" 
             routerLink="/admin" 
             class="btn btn-sm btn-primary fw-bold d-flex align-items-center gap-1 rounded-pill px-3 shadow-sm"
             title="Ir al Panel Admin">
             <i class="bi bi-speedometer2"></i>
             <span>Admin</span>
          </a>

          <div class="dropdown">
            <a class="d-flex align-items-center text-decoration-none cursor-pointer" 
               data-bs-toggle="dropdown" 
               aria-expanded="false">
               
               <div *ngIf="!authService.currentUserProfile()" class="d-flex align-items-center gap-2">
                  <div class="bg-light rounded-circle d-flex align-items-center justify-content-center border" style="width: 40px; height: 40px;">
                    <i class="bi bi-person fs-5 text-dark"></i>
                  </div>
                  <div class="d-none d-lg-block lh-sm text-start">
                    <small class="text-muted d-block" style="font-size: 0.7rem;">Bienvenido</small>
                    <span class="fw-bold text-dark small">Inicia sesión</span>
                  </div>
               </div>

               <div *ngIf="authService.currentUserProfile()" class="d-flex align-items-center gap-2">
                  <div class="bg-light rounded-circle d-flex align-items-center justify-content-center border text-success fw-bold" style="width: 40px; height: 40px;">
                    {{ obtenerIniciales() }}
                  </div>
                  <div class="d-none d-lg-block lh-sm text-start">
                    <small class="text-muted d-block" style="font-size: 0.7rem;">Hola,</small>
                    <span class="fw-bold text-success small text-truncate" style="max-width: 100px;">{{ obtenerNombreBonito() }}</span>
                  </div>
               </div>
            </a>

            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li *ngIf="!authService.currentUserProfile()">
                <a class="dropdown-item fw-bold text-success" routerLink="/login">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
                </a>
                <a class="dropdown-item small" routerLink="/register">Registrarse</a>
              </li>

              <div *ngIf="authService.currentUserProfile()">
                <li><span class="dropdown-item-text text-muted small fst-italic">{{ authService.currentUser()?.email }}</span></li>
                <li><hr class="dropdown-divider"></li>
                
                <li><a class="dropdown-item" routerLink="/perfil"><i class="bi bi-person-gear me-2"></i>Mi Perfil</a></li>
                <li><a class="dropdown-item" routerLink="/mis-compras"><i class="bi bi-bag me-2"></i>Mis Compras</a></li>
                
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger fw-bold" (click)="logout()">
                    <i class="bi bi-power me-2"></i>Cerrar Sesión
                  </button>
                </li>
              </div>
            </ul>
          </div>

          <a routerLink="/favoritos" class="text-dark fs-5 cursor-pointer position-relative d-none d-sm-block">
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
    .dropdown-toggle::after { display: none !important; }
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
    if (perfil) {
      return perfil.nombre.split(' ')[0];
    }
    return '';
  }

  obtenerIniciales() {
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