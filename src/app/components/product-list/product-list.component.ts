import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Producto } from '../../models/product.model';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  template: `
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
      
      <div class="col" *ngFor="let item of storeService.productosFiltrados()">
        
        <div class="card h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden position-relative bg-white"
             [class.opacity-75]="item.stock === 0">
          
          <div class="position-absolute top-0 start-0 m-3 z-2 d-flex flex-column gap-1">
             <span *ngIf="tieneOferta(item) && (item.stock || 0) > 0" class="badge bg-danger rounded-pill shadow-sm px-3">
               -{{ calcularPorcentaje(item) }}%
             </span>
             <span *ngIf="item.stock === 0" class="badge bg-secondary rounded-pill shadow-sm px-3">
               AGOTADO
             </span>
          </div>
          
          <button class="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3 p-2 z-2 d-flex align-items-center justify-content-center" 
                  style="width: 35px; height: 35px;"
                  (click)="toggleFav(item); $event.stopPropagation()"> 
             <i class="bi" style="font-size: 1rem;"
                [class.bi-heart]="!storeService.esFavorito(item.id!)" 
                [class.bi-heart-fill]="storeService.esFavorito(item.id!)"
                [class.text-danger]="storeService.esFavorito(item.id!)"
                [class.text-muted]="!storeService.esFavorito(item.id!)">
             </i>
          </button>

          <div class="p-4 d-flex align-items-center justify-content-center bg-white cursor-pointer" 
               style="height: 220px;"
               [routerLink]="['/producto', item.slug || item.id]">
             <img [src]="item.imagen" class="img-fluid object-fit-contain product-img transition-transform" 
                  style="max-height: 100%; max-width: 100%;" 
                  [class.grayscale]="item.stock === 0" 
                  alt="{{ item.nombre }}">
          </div>
          
          <div class="card-body p-3 d-flex flex-column border-top border-light">
            
            <div class="mb-2">
               <small class="text-uppercase fw-bold text-muted" style="font-size: 0.7rem; letter-spacing: 0.5px;">{{ item.marca }}</small>
               <h6 class="card-title fw-bold text-dark mb-1 text-truncate-2 lh-sm cursor-pointer hover-text-primary"
                   [routerLink]="['/producto', item.slug || item.id]">
                   {{ item.nombre }}
               </h6>
            </div>
            
            <div class="mt-auto pt-2">
              <div class="d-flex align-items-baseline gap-2 mb-3">
                 <span *ngIf="tieneOferta(item)" class="fw-bold text-danger fs-5">S/ {{ item.precioOferta | number:'1.2-2' }}</span>
                 <span *ngIf="!tieneOferta(item)" class="fw-bold text-dark fs-5">S/ {{ item.precio | number:'1.2-2' }}</span>
                 
                 <small *ngIf="tieneOferta(item)" class="text-decoration-line-through text-muted small">
                    S/ {{ item.precio | number:'1.2-2' }}
                 </small>
              </div>
              
              <button class="btn w-100 rounded-pill fw-bold py-2 transition-all d-flex align-items-center justify-content-center gap-2"
                      [class.btn-dark]="(item.stock || 0) > 0"
                      [class.btn-outline-secondary]="item.stock === 0"
                      [disabled]="item.stock === 0"
                      (click)="agregarAlCarrito(item); $event.stopPropagation()">
                <i class="bi" [class.bi-bag-plus-fill]="(item.stock || 0) > 0" [class.bi-slash-circle]="item.stock === 0"></i>
                <span style="font-size: 0.9rem;">{{ (item.stock || 0) > 0 ? 'Agregar' : 'Sin Stock' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card { transition: all 0.3s ease; }
    .hover-card:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
    .product-img { transition: transform 0.3s ease; }
    .hover-card:hover .product-img { transform: scale(1.08); }
    .grayscale { filter: grayscale(100%); opacity: 0.5; }
    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.4em; }
    .hover-text-primary:hover { color: #198754 !important; }
    .btn-dark:hover { background-color: #198754; border-color: #198754; transform: scale(1.02); }
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