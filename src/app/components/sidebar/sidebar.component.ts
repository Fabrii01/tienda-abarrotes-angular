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
    <div class="offcanvas offcanvas-start" tabindex="-1" id="menuFalabella" aria-labelledby="menuLabel">
      
      <div class="offcanvas-header bg-success text-white">
        
        <h5 *ngIf="!authService.currentUserProfile()" 
            class="offcanvas-title fw-bold" 
            routerLink="/login" 
            data-bs-dismiss="offcanvas"
            style="cursor: pointer;">
          <i class="bi bi-person-circle me-2"></i> Hola, Inicia sesión
        </h5>

        <h5 *ngIf="authService.currentUserProfile()" 
            class="offcanvas-title fw-bold">
          <i class="bi bi-person-check-fill me-2"></i> Hola, {{ obtenerNombreBonito() }}
        </h5>

        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      
      <div class="offcanvas-body p-0">
        <div class="list-group list-group-flush">
          <div class="p-3 bg-light fw-bold text-muted small">CATEGORÍAS</div>

          <button (click)="filtrar('Todos')" data-bs-dismiss="offcanvas" class="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center">
             <span>Todos los productos</span> <i class="bi bi-chevron-right text-muted"></i>
          </button>

          <button (click)="filtrar('Granos')" data-bs-dismiss="offcanvas" class="list-group-item list-group-item-action py-3 d-flex justify-content-between">
             <span>Granos y Arroz</span> <i class="bi bi-chevron-right text-muted"></i>
          </button>

          <button (click)="filtrar('Aceites')" data-bs-dismiss="offcanvas" class="list-group-item list-group-item-action py-3 d-flex justify-content-between">
             <span>Aceites</span> <i class="bi bi-chevron-right text-muted"></i>
          </button>

          <button (click)="filtrar('Lácteos')" data-bs-dismiss="offcanvas" class="list-group-item list-group-item-action py-3 d-flex justify-content-between">
             <span>Lácteos</span> <i class="bi bi-chevron-right text-muted"></i>
          </button>
          
          <button (click)="filtrar('Bebidas')" data-bs-dismiss="offcanvas" class="list-group-item list-group-item-action py-3 d-flex justify-content-between">
             <span>Bebidas</span> <i class="bi bi-chevron-right text-muted"></i>
          </button>

          <div *ngIf="authService.currentUserProfile()" class="mt-3 border-top">
            <button (click)="logout()" data-bs-dismiss="offcanvas" class="list-group-item list-group-item-action py-3 text-danger fw-bold">
              <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  
  filtrar(categoria: string) {
    this.storeService.cambiarCategoria(categoria);
  }

  // Lógica actualizada: Primer Nombre + Primer Apellido
  obtenerNombreBonito() {
    const perfil = this.authService.currentUserProfile();
    if (perfil) {
      const primerNombre = perfil.nombre.split(' ')[0];
      const primerApellido = perfil.apellidos.split(' ')[0];
      return `${primerNombre} ${primerApellido}`;
    }
    return 'Usuario';
  }

  logout() {
    this.authService.logout();
    // Opcional: Podrías navegar al login si quisieras forzar la salida de la página actual
    // this.router.navigate(['/login']); 
  }
}