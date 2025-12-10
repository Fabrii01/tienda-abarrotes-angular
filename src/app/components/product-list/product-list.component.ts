import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
      
      <div class="col" *ngFor="let item of storeService.productosFiltrados()">
        
        <div class="card h-100 border-0 shadow-sm product-card position-relative"> <button class="btn btn-link position-absolute top-0 end-0 p-2 text-decoration-none" 
                  (click)="toggleFav(item)"
                  style="z-index: 10;">
            <i class="bi fs-5" 
               [class.bi-heart]="!storeService.esFavorito(item.id!)" 
               [class.bi-heart-fill]="storeService.esFavorito(item.id!)"
               [class.text-danger]="storeService.esFavorito(item.id!)"
               [class.text-muted]="!storeService.esFavorito(item.id!)">
            </i>
          </button>

          <div class="position-absolute top-0 start-0 m-2">
             <span class="badge bg-danger rounded-pill small-text">-20%</span>
          </div>
          
          <div class="image-container p-2 text-center">
             <img [src]="item.imagen" class="img-fluid product-image" alt="...">
          </div>
          
          <div class="card-body p-2 d-flex flex-column">
            <p class="text-muted mb-1 brand-text">{{ item.categoria | uppercase }}</p>
            <h6 class="card-title text-truncate-2 mb-2 product-title">{{ item.nombre }}</h6>
            
            <div class="mt-auto">
              <small class="text-decoration-line-through text-muted small-text">
                 S/ {{ (item.precio * 1.2) | number:'1.2-2' }}
              </small>
              
              <div class="d-flex justify-content-between align-items-center">
                 <span class="fw-bold text-dark fs-6">S/ {{ item.precio | number:'1.2-2' }}</span>
                 
                 <button class="btn btn-sm btn-success rounded-circle btn-add" 
                         (click)="agregarAlCarrito(item)" 
                         title="Agregar al carrito">
                   <i class="bi bi-plus-lg"></i>
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div *ngIf="storeService.productosFiltrados().length === 0" class="col-12 text-center py-5">
        <i class="bi bi-search display-6 text-muted"></i>
        <p class="mt-2 text-muted">No encontramos productos con ese nombre.</p>
      </div>

    </div>
  `,
  styles: [`
    /* ... (Mismos estilos de antes) ... */
    .image-container { height: 160px; display: flex; align-items: center; justify-content: center; background-color: #fff; }
    .product-image { max-height: 100%; max-width: 100%; object-fit: contain; transition: transform 0.3s ease; }
    .brand-text { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.5px; }
    .product-title { font-size: 0.9rem; line-height: 1.2; color: #333; }
    .small-text { font-size: 0.75rem; }
    .product-card { transition: box-shadow 0.2s; border: 1px solid #eee; }
    .product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
    .product-card:hover .product-image { transform: scale(1.05); }
    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal; }
    .btn-add { width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; }
  `]
})
export class ProductListComponent {
  storeService = inject(StoreService);

  agregarAlCarrito(producto: Producto) {
    this.storeService.agregarProducto(producto);
  }

  // Conectamos el botón con el servicio
  toggleFav(producto: Producto) {
    this.storeService.toggleFavorito(producto);
  }
}