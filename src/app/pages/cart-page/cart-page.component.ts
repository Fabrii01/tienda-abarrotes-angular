import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para poder volver al inicio
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <h2 class="mb-4 fw-bold">Tu Carrito de Compras</h2>

      <div class="row" *ngIf="storeService.carrito().length > 0; else emptyCart">
        
        <div class="col-md-8">
          <div class="card border-0 shadow-sm mb-3" *ngFor="let item of storeService.carrito(); let i = index">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <img [src]="item.imagen" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
                
                <div class="ms-3 flex-grow-1">
                  <h5 class="mb-1">{{ item.nombre }}</h5>
                  <p class="text-muted small mb-0">{{ item.categoria }}</p>
                </div>

                <div class="text-end">
                  <h5 class="fw-bold text-primary mb-2">S/ {{ item.precio | number:'1.2-2' }}</h5>
                  <button class="btn btn-sm btn-outline-danger" (click)="eliminar(i)">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-light">
            <div class="card-body p-4">
              <h4 class="fw-bold mb-4">Resumen del Pedido</h4>
              
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>Envío</span>
                <span class="text-success">Gratis</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-4">
                <span class="h5 fw-bold">Total</span>
                <span class="h5 fw-bold text-success">S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
              </div>

              <button class="btn btn-dark w-100 btn-lg mb-2">Pagar Ahora</button>
              <a routerLink="/" class="btn btn-outline-secondary w-100">Seguir Comprando</a>
            </div>
          </div>
        </div>

      </div>

      <ng-template #emptyCart>
        <div class="text-center py-5">
          <i class="bi bi-cart-x display-1 text-muted"></i>
          <h3 class="mt-3">Tu carrito está vacío</h3>
          <p class="text-muted">Parece que no has agregado nada aún.</p>
          <a routerLink="/" class="btn btn-primary mt-3">Ir a la tienda</a>
        </div>
      </ng-template>

    </div>
  `
})
export class CartPageComponent {
  storeService = inject(StoreService);

  eliminar(index: number) {
    this.storeService.eliminarProducto(index);
  }
}