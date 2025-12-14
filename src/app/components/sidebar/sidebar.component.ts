import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="offcanvas offcanvas-start border-0 shadow-lg" tabindex="-1" id="menuFalabella" aria-labelledby="menuLabel" style="width: 300px;">
      
      <div class="offcanvas-header p-4 text-white position-relative overflow-hidden" 
           style="background: linear-gradient(135deg, #198754, #0f5132);">
        
        <div class="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle" style="width: 100px; height: 100px; margin-top: -30px; margin-right: -30px;"></div>
        
        <div class="position-relative z-1 w-100">
          <div class="d-flex align-items-center justify-content-between mb-3">
             <h5 class="fw-bold m-0 text-white-50 small text-uppercase ls-1">Menú</h5>
             <button type="button" class="btn-close btn-close-white opacity-75 hover-opacity-100" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div *ngIf="!authService.currentUserProfile()" 
               class="d-flex align-items-center gap-3 cursor-pointer p-2 rounded hover-glass"
               routerLink="/login" data-bs-dismiss="offcanvas">
             <div class="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 48px; height: 48px;">
               <i class="bi bi-person-fill fs-4"></i>
             </div>
             <div>
               <div class="fw-bold fs-5">Hola, identifícate</div>
               <small class="text-white-50">Para ver tus pedidos</small>
             </div>
          </div>

          <div *ngIf="authService.currentUserProfile()" class="d-flex align-items-center gap-3">
             <div class="bg-warning text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 48px; height: 48px;">
               {{ obtenerIniciales() }}
             </div>
             <div>
               <div class="fw-bold fs-5">{{ obtenerNombreBonito() }}</div>
               <div class="badge bg-white bg-opacity-25 text-white fw-normal px-2">Cliente VIP</div>
             </div>
          </div>
        </div>
      </div>
      
      <div class="offcanvas-body p-0 custom-scrollbar">
        
        <div class="py-2">
           <a routerLink="/" class="sidebar-link d-flex align-items-center px-4 py-3 text-decoration-none text-dark" data-bs-dismiss="offcanvas">
             <i class="bi bi-house-door me-3 fs-5 text-muted"></i>
             <span class="fw-medium">Inicio</span>
           </a>
           <a routerLink="/mis-compras" class="sidebar-link d-flex align-items-center px-4 py-3 text-decoration-none text-dark" data-bs-dismiss="offcanvas">
             <i class="bi bi-bag-check me-3 fs-5 text-muted"></i>
             <span class="fw-medium">Mis Compras</span>
           </a>
           <a routerLink="/favoritos" class="sidebar-link d-flex align-items-center px-4 py-3 text-decoration-none text-dark" data-bs-dismiss="offcanvas">
             <i class="bi bi-heart me-3 fs-5 text-muted"></i>
             <span class="fw-medium">Favoritos</span>
           </a>
        </div>

        <hr class="my-0 border-light">

        <div class="py-3">
          <div class="px-4 mb-2 text-uppercase text-muted small fw-bold ls-1">Explorar Categorías</div>
          
          <button (click)="filtrar('Todos')" data-bs-dismiss="offcanvas" 
                  class="sidebar-link w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center px-4 py-3">
             <span class="fw-medium text-success"><i class="bi bi-grid-fill me-3"></i>Ver Todo</span> 
             <i class="bi bi-arrow-right text-success small"></i>
          </button>

          <button *ngFor="let cat of storeService.categorias()" 
                  (click)="filtrar(cat.nombre)" 
                  data-bs-dismiss="offcanvas" 
                  class="sidebar-link w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center px-4 py-3 text-dark">
             <span>{{ cat.nombre }}</span> 
             <i class="bi bi-chevron-right text-muted small icon-move"></i>
          </button>
          
          <div *ngIf="storeService.categorias().length === 0" class="px-4 py-3 text-muted small fst-italic">
            <span class="spinner-border spinner-border-sm me-2"></span> Cargando categorías...
          </div>
        </div>

      </div>

      <div class="offcanvas-footer p-3 bg-light border-top" *ngIf="authService.currentUserProfile()">
        <button (click)="logout()" data-bs-dismiss="offcanvas" 
                class="btn btn-outline-danger w-100 border-0 d-flex align-items-center justify-content-center gap-2 py-2 hover-danger">
          <i class="bi bi-box-arrow-left"></i> Cerrar Sesión
        </button>
      </div>

    </div>
  `,
  styles: [`
    /* Interacciones del Menú */
    .sidebar-link {
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }
    
    .sidebar-link:hover {
      background-color: #f8f9fa; /* Gris muy suave */
      border-left-color: #198754; /* Borde verde a la izquierda */
      padding-left: 1.8rem !important; /* Efecto de desplazamiento */
      color: #198754 !important;
    }

    .sidebar-link:hover i.text-muted {
      color: #198754 !important;
    }

    .icon-move { transition: transform 0.2s; }
    .sidebar-link:hover .icon-move { transform: translateX(5px); }

    /* Cabecera */
    .ls-1 { letter-spacing: 1px; }
    .hover-glass:hover { background: rgba(255,255,255,0.1); }
    .cursor-pointer { cursor: pointer; }

    /* Footer */
    .hover-danger:hover { background-color: #dc3545; color: white; }
    
    /* Scrollbar invisible pero funcional */
    .custom-scrollbar { overflow-y: auto; scrollbar-width: thin; }
  `]
})
export class SidebarComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  
  filtrar(categoria: string) {
    this.storeService.cambiarCategoria(categoria);
  }

  obtenerNombreBonito() {
    const perfil = this.authService.currentUserProfile();
    if (perfil) {
      const primerNombre = perfil.nombre.split(' ')[0];
      // Capitalizar primera letra
      return primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
    }
    return 'Usuario';
  }

  obtenerIniciales() {
    const perfil = this.authService.currentUserProfile();
    if (perfil && perfil.nombre) {
      return perfil.nombre.charAt(0).toUpperCase();
    }
    return 'U';
  }

  logout() {
    this.authService.logout();
  }
}