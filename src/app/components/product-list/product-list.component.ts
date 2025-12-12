import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Producto } from '../../models/product.model';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- Agregamos RouterLink
  template: `
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
      
      <div class="col" *ngFor="let item of storeService.productosFiltrados()">
        
        <div class="card h-100 border-0 shadow-sm product-card position-relative"
             [class.opacity-75]="item.stock === 0">
          
          <div class="position-absolute top-0 start-0 m-2 z-2" 
               *ngIf="tieneOferta(item) && item.stock! > 0">
             <span class="badge bg-danger rounded-pill small-text shadow-sm">
               -{{ calcularPorcentaje(item) }}%
             </span>
          </div>

          <div class="position-absolute top-0 start-0 m-2 z-2" *ngIf="item.stock === 0">
             <span class="badge bg-secondary rounded-pill small-text shadow-sm">AGOTADO</span>
          </div>
          
          <button class="btn btn-link position-absolute top-0 end-0 p-2 z-2 text-decoration-none" 
                  (click)="toggleFav(item); $event.stopPropagation()"> <i class="bi fs-5" 
               [class.bi-heart]="!storeService.esFavorito(item.id!)" 
               [class.bi-heart-fill]="storeService.esFavorito(item.id!)"
               [class.text-danger]="storeService.esFavorito(item.id!)"
               [class.text-muted]="!storeService.esFavorito(item.id!)">
            </i>
          </button>

          <div class="image-container p-2 text-center position-relative cursor-pointer"
               [routerLink]="['/producto', item.slug || item.id]">
             <img [src]="item.imagen" class="img-fluid product-image" [class.grayscale]="item.stock === 0" alt="...">
          </div>
          
          <div class="card-body p-2 d-flex flex-column">
            
            <div class="d-flex justify-content-between align-items-center mb-1">
               <small class="text-muted brand-text">{{ item.marca | uppercase }}</small>
               <small class="text-muted" style="font-size: 0.65rem;">{{ item.categoria }}</small>
            </div>

            <h6 class="card-title text-truncate-2 mb-2 product-title cursor-pointer"
                [routerLink]="['/product', item.id]">
                {{ item.nombre }}
            </h6>
            
            <div class="mt-auto">
              
              <div class="d-flex align-items-end gap-2 mb-2" *ngIf="tieneOferta(item)">
                 <span class="fw-bold text-danger fs-6">S/ {{ item.precioOferta | number:'1.2-2' }}</span>
                 <small class="text-decoration-line-through text-muted small-text mb-1">
                    S/ {{ item.precio | number:'1.2-2' }}
                 </small>
              </div>

              <div class="mb-2" *ngIf="!tieneOferta(item)">
                 <span class="fw-bold text-dark fs-6">S/ {{ item.precio | number:'1.2-2' }}</span>
              </div>
              
              <div class="d-grid">
                 <button class="btn btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                         [class.btn-success]="item.stock! > 0"
                         [class.btn-secondary]="item.stock === 0"
                         [disabled]="item.stock === 0"
                         (click)="agregarAlCarrito(item); $event.stopPropagation()">
                   <i class="bi" [class.bi-cart-plus]="item.stock! > 0" [class.bi-slash-circle]="item.stock === 0"></i>
                   {{ item.stock! > 0 ? 'Agregar' : 'Sin Stock' }}
                 </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; } /* <--- ESTILO PARA LA MANITO */
    .image-container { height: 160px; display: flex; align-items: center; justify-content: center; background-color: #fff; }
    .product-image { max-height: 100%; max-width: 100%; object-fit: contain; transition: transform 0.3s ease; }
    .grayscale { filter: grayscale(100%); opacity: 0.6; }
    .brand-text { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.5px; color: #6c757d; }
    .product-title { font-size: 0.9rem; line-height: 1.2; color: #333; }
    .product-title:hover { text-decoration: underline; color: #198754; } /* Hover verde en titulo */
    .small-text { font-size: 0.75rem; }
    .product-card { transition: box-shadow 0.2s; border: 1px solid #f0f0f0; }
    .product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; border-color: transparent; }
    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal; }
  `]
})
export class ProductListComponent {
  storeService = inject(StoreService);
  

  agregarAlCarrito(producto: Producto) {
    if (producto.stock && producto.stock > 0) {
      this.storeService.agregarProducto(producto);
    }
  }

  toggleFav(producto: Producto) {
    this.storeService.toggleFavorito(producto);
  }

  tieneOferta(p: Producto): boolean {
    return !!p.precioOferta && p.precioOferta < p.precio;
  }

  calcularPorcentaje(p: Producto): number {
    if (!p.precioOferta || !p.precio) return 0;
    return Math.round((1 - (p.precioOferta / p.precio)) * 100);
  }
}
