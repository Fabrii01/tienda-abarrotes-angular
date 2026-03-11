import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="offcanvas offcanvas-start border-0 shadow-lg" tabindex="-1" id="menuFatahi" style="width: 300px;">
      
      <div class="offcanvas-header p-4 text-white position-relative overflow-hidden" style="background: linear-gradient(135deg, #198754, #0f5132);">
        <div class="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle" style="width: 100px; height: 100px; margin-top: -30px; margin-right: -30px;"></div>
        
        <div class="position-relative z-1 w-100">
          <div class="d-flex align-items-center justify-content-between mb-3">
             <button type="button" class="btn-close btn-close-white opacity-75 hover-opacity-100" data-bs-dismiss="offcanvas"></button>
          </div>

          <div class="d-flex align-items-center gap-3">
             <div class="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 55px; height: 55px;">
               <i class="bi bi-shop fs-3"></i>
             </div>
             <div>
               <div class="fw-bold fs-4">Fatahi</div>
               <small class="text-white-50">Catálogo Oficial</small>
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
        </div>
        <hr class="my-0 border-light">
        <div class="py-3">
          <div class="px-4 mb-2 text-uppercase text-muted small fw-bold ls-1">Nuestros Productos</div>
          
          <button (click)="filtrar('Todos')" data-bs-dismiss="offcanvas" class="sidebar-link w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center px-4 py-3">
             <span class="fw-medium text-success"><i class="bi bi-grid-fill me-3"></i>Ver Todo</span> 
          </button>

          <button *ngFor="let cat of storeService.categorias()" (click)="filtrar(cat.nombre)" data-bs-dismiss="offcanvas" class="sidebar-link w-100 border-0 bg-transparent text-start d-flex justify-content-between align-items-center px-4 py-3 text-dark">
             <span>{{ cat.nombre }}</span> 
             <i class="bi bi-chevron-right text-muted small icon-move"></i>
          </button>
        </div>
      </div>

      <div class="offcanvas-footer p-3 bg-light border-top" *ngIf="authService.currentUserProfile()">
        <button (click)="logout()" data-bs-dismiss="offcanvas" class="btn btn-outline-danger w-100 fw-bold py-2 hover-danger">
          <i class="bi bi-box-arrow-left me-2"></i> Cerrar Sesión Admin
        </button>
      </div>

    </div>
  `,
  styles: [`
    .sidebar-link { transition: all 0.2s ease; border-left: 4px solid transparent; }
    .sidebar-link:hover { background-color: #f8f9fa; border-left-color: #198754; padding-left: 1.8rem !important; color: #198754 !important; }
    .sidebar-link:hover i.text-muted { color: #198754 !important; }
    .icon-move { transition: transform 0.2s; }
    .sidebar-link:hover .icon-move { transform: translateX(5px); }
    .ls-1 { letter-spacing: 1px; }
    .hover-danger:hover { background-color: #dc3545; color: white; }
    .custom-scrollbar { overflow-y: auto; scrollbar-width: thin; }
  `]
})
export class SidebarComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  router = inject(Router);

  filtrar(categoria: string) { this.storeService.cambiarCategoria(categoria); }
  logout() { this.authService.logout(); this.router.navigate(['/']); }
}