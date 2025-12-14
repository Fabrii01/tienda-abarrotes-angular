import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service'; // 1. Importar AuthService
import { RouterLink, Router } from '@angular/router';      // 2. Importar Router

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5 animate-fade-in">
      
      <div class="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
        <h2 class="fw-bold mb-0 text-dark">Carrito de Compras</h2>
        <span class="badge bg-dark rounded-pill">{{ contarItems() }} items</span>
      </div>

      <div class="row g-5" *ngIf="storeService.carrito().length > 0; else emptyCart">
        
        <div class="col-lg-8">
          
          <div class="alert alert-success d-flex align-items-center border-0 bg-success bg-opacity-10 mb-4" role="alert">
            <i class="bi bi-truck fs-4 me-3 text-success"></i>
            <div>
               <strong class="text-success">¡Felicidades!</strong> Tienes envío gratis en este pedido.
            </div>
          </div>

          <div class="card border-0 shadow-sm mb-3 overflow-hidden" *ngFor="let item of storeService.carrito(); let i = index">
            <div class="card-body p-4">
              <div class="row align-items-center">
                
                <div class="col-3 col-md-2">
                  <div class="bg-light rounded p-2 text-center">
                     <img [src]="item.imagen" class="img-fluid object-fit-contain" style="max-height: 80px;" alt="{{ item.nombre }}">
                  </div>
                </div>
                
                <div class="col-9 col-md-5">
                  <h6 class="mb-1 fw-bold text-dark text-truncate">{{ item.nombre }}</h6>
                  <div class="text-muted small mb-2 text-uppercase">{{ item.marca }}</div>
                  
                  <div class="d-flex align-items-center gap-2">
                     <span class="text-dark fw-bold">S/ {{ obtenerPrecioUnitario(item) | number:'1.2-2' }}</span>
                     <span *ngIf="tieneDescuento(item)" class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 small">
                        -{{ calcularAhorro(item) | number:'1.2-2' }} ahorro
                     </span>
                  </div>
                </div>

                <div class="col-6 col-md-3 mt-3 mt-md-0">
                  <div class="input-group input-group-sm bg-light rounded border">
                    <button class="btn btn-link text-dark text-decoration-none" (click)="cambiarCantidad(item.id!, -1)">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input type="text" class="form-control text-center bg-transparent border-0 fw-bold" [value]="item.cantidadCarrito" readonly>
                    <button class="btn btn-link text-dark text-decoration-none" (click)="cambiarCantidad(item.id!, 1)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>

                <div class="col-6 col-md-2 mt-3 mt-md-0 text-end d-flex flex-column align-items-end justify-content-between h-100">
                   <button class="btn btn-link text-danger p-0 mb-2" (click)="eliminar(i)" title="Eliminar">
                     <i class="bi bi-trash3"></i>
                   </button>
                   <span class="fw-bold fs-6">S/ {{ (obtenerPrecioUnitario(item) * (item.cantidadCarrito || 1)) | number:'1.2-2' }}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-lg p-4 bg-white rounded-4 sticky-top" style="top: 100px; z-index: 1;">
            <h5 class="fw-bold mb-4">Resumen del Pedido</h5>
            
            <div class="d-flex justify-content-between mb-2 text-muted">
              <span>Subtotal</span>
              <span>S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2 text-success fw-bold">
              <span>Descuentos</span>
              <span>- S/ {{ totalAhorrado() | number:'1.2-2' }}</span>
            </div>
            <div class="d-flex justify-content-between mb-4 text-success">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            
            <hr class="border-secondary opacity-10">
            
            <div class="d-flex justify-content-between mb-4 align-items-center">
              <span class="fs-5 fw-bold text-dark">Total a Pagar</span>
              <span class="fs-3 fw-bold text-dark">S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
            </div>

            <button class="btn btn-dark w-100 py-3 fw-bold rounded-pill shadow-sm hover-scale mb-3" 
                    (click)="irAPagar()">
              <i class="bi bi-credit-card-2-front me-2"></i> Ir a Pagar
            </button>
            
            <a routerLink="/" class="btn btn-link text-muted w-100 text-decoration-none small">
              <i class="bi bi-arrow-left me-1"></i> Seguir comprando
            </a>

            <div class="mt-4 pt-3 border-top text-center opacity-50 grayscale">
               <i class="bi bi-credit-card-2-back fs-4 mx-2"></i>
               <i class="bi bi-qr-code fs-4 mx-2"></i>
               <i class="bi bi-cash-coin fs-4 mx-2"></i>
            </div>
          </div>
        </div>

      </div>

      <ng-template #emptyCart>
        <div class="text-center py-5">
          <div class="mb-4">
             <div class="bg-light rounded-circle d-inline-flex p-4">
               <i class="bi bi-cart3 display-1 text-muted opacity-25"></i>
             </div>
          </div>
          <h3 class="fw-bold text-dark mb-3">Tu carrito está vacío</h3>
          <p class="text-muted mb-4">¿No sabes qué comprar? ¡Tenemos miles de productos frescos esperándote!</p>
          <button class="btn btn-success btn-lg rounded-pill px-5 fw-bold shadow-sm hover-scale" routerLink="/">
            Empezar a comprar
          </button>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    .hover-scale:hover { transform: translateY(-2px); }
    .grayscale { filter: grayscale(100%); }
  `]
})
export class CartPageComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService); // Inyectamos Auth
  router = inject(Router);           // Inyectamos Router

  // Lógica de seguridad para pagar
  irAPagar() {
    if (this.authService.currentUserProfile()) {
      // Si está logueado, pasa al checkout
      this.router.navigate(['/checkout']);
    } else {
      // Si NO está logueado, alerta y manda al login
      alert('🔒 Para finalizar tu compra, necesitas iniciar sesión o registrarte.');
      this.router.navigate(['/login']);
    }
  }

  contarItems() {
    return this.storeService.carrito().reduce((acc: number, item: any) => acc + (item.cantidadCarrito || 1), 0);
  }

  obtenerPrecioUnitario(item: any): number {
    return (item.precioOferta && item.precioOferta < item.precio) ? item.precioOferta : item.precio;
  }

  tieneDescuento(item: any): boolean {
    return !!item.precioOferta && item.precioOferta < item.precio;
  }

  calcularAhorro(item: any): number {
    if (!this.tieneDescuento(item)) return 0;
    return item.precio - item.precioOferta;
  }

  totalAhorrado = computed(() => {
    return this.storeService.carrito().reduce((acc: number, item: any) => {
      const ahorroUnitario = this.tieneDescuento(item) ? (item.precio - item.precioOferta) : 0;
      return acc + (ahorroUnitario * (item.cantidadCarrito || 1));
    }, 0);
  });

  cambiarCantidad(id: string, val: number) {
    this.storeService.actualizarCantidadId(id, val);
  }

  eliminar(index: number) {
    if(confirm('¿Eliminar producto del carrito?')) {
      this.storeService.eliminarProducto(index);
    }
  }
}