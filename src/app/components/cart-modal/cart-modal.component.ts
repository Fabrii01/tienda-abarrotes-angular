import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered"> <div class="modal-content">
          
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="cartModalLabel">
              <i class="bi bi-cart4 me-2"></i>Tu Carrito de Compras
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            
            <div *ngIf="storeService.carrito().length === 0" class="text-center py-5">
              <i class="bi bi-cart-x display-1 text-muted"></i>
              <p class="mt-3 text-muted">Tu carrito está vacío. ¡Ve a comprar algo rico!</p>
              <button class="btn btn-primary" data-bs-dismiss="modal">Ir a comprar</button>
            </div>

            <div *ngIf="storeService.carrito().length > 0">
              <div class="table-responsive">
                <table class="table align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th class="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of storeService.carrito(); let i = index">
                      <td>
                        <div class="d-flex align-items-center">
                          <img [src]="item.imagen" alt="" style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3">
                          <div>
                            <span class="fw-bold d-block">{{ item.nombre }}</span>
                            <small class="text-muted">{{ item.categoria }}</small>
                          </div>
                        </div>
                      </td>
                      <td class="fw-bold text-success">S/ {{ item.precio | number:'1.2-2' }}</td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" (click)="eliminar(i)" title="Eliminar">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div class="modal-footer justify-content-between" *ngIf="storeService.carrito().length > 0">
            <div class="h5 mb-0">
              Total: <span class="fw-bold text-success display-6 ms-2">S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
            </div>
            <div>
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Seguir comprando</button>
              <button type="button" class="btn btn-success btn-lg" (click)="procesarCompra()">
                <i class="bi bi-credit-card me-2"></i>Pagar Ahora
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CartModalComponent {
  storeService = inject(StoreService);

  eliminar(index: number) {
    this.storeService.eliminarProducto(index);
  }

  procesarCompra() {
    // Aquí iría la integración con pasarela de pagos
    alert('¡Gracias por tu compra! Tu pedido llegará pronto.');
    // Limpiamos el carrito (opcional)
    // this.storeService.carrito.set([]); 
  }
}