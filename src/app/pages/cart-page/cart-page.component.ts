import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <h2 class="fw-bold mb-4">Tu Carrito de Compras</h2>

      <div class="row" *ngIf="storeService.carrito().length > 0; else emptyCart">
        
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-3" *ngFor="let item of storeService.carrito(); let i = index">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                
                <img [src]="item.imagen" class="rounded" style="width: 80px; height: 80px; object-fit: contain;">
                
                <div class="flex-grow-1">
                  <h5 class="mb-1 fw-bold">{{ item.nombre }}</h5>
                  <div class="text-muted small mb-2">{{ item.marca }} | {{ item.categoria }}</div>
                  <div class="text-success fw-bold">S/ {{ obtenerPrecioUnitario(item) | number:'1.2-2' }}</div>
                </div>

                <div class="d-flex flex-column align-items-center">
                  <div class="input-group input-group-sm mb-2" style="width: 100px;">
                    <button class="btn btn-outline-secondary" (click)="cambiarCantidad(item.id!, -1)">-</button>
                    <input type="text" class="form-control text-center bg-white" [value]="item.cantidadCarrito" readonly>
                    <button class="btn btn-outline-secondary" (click)="cambiarCantidad(item.id!, 1)">+</button>
                  </div>
                  <small class="fw-bold text-dark">
                    Sub: S/ {{ (obtenerPrecioUnitario(item) * (item.cantidadCarrito || 1)) | number:'1.2-2' }}
                  </small>
                </div>

                <button class="btn btn-outline-danger border-0" (click)="eliminar(i)">
                  <i class="bi bi-trash-fill"></i>
                </button>

              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm p-3">
            <h5 class="fw-bold mb-3">Resumen del Pedido</h5>
            <div class="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3 text-success">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-4 fs-4 fw-bold">
              <span>Total</span>
              <span>S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
            </div>

<button class="btn btn-dark w-100 py-3 fw-bold mb-2" routerLink="/checkout">
  Pagar Ahora
</button>
            <button class="btn btn-outline-secondary w-100 mt-2" routerLink="/">Seguir Comprando</button>
          </div>
        </div>

      </div>

      <ng-template #emptyCart>
        <div class="text-center py-5 bg-light rounded">
          <i class="bi bi-cart-x display-1 text-muted"></i>
          <h3 class="mt-3">Tu carrito está vacío</h3>
          <p class="text-muted">¡Agrega productos para comenzar!</p>
          <button class="btn btn-success mt-3" routerLink="/">Ir a comprar</button>
        </div>
      </ng-template>

    </div>
  `
})
export class CartPageComponent {
  storeService = inject(StoreService);

  obtenerPrecioUnitario(item: any): number {
    return (item.precioOferta && item.precioOferta < item.precio) ? item.precioOferta : item.precio;
  }

  cambiarCantidad(id: string, val: number) {
    this.storeService.actualizarCantidadId(id, val);
  }

  eliminar(index: number) {
    this.storeService.eliminarProducto(index);
  }
}