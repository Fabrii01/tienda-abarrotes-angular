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
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 g-md-4">
      
      <div class="col" *ngFor="let item of storeService.productosFiltrados()">
        <div class="card h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden position-relative bg-white" [class.opacity-75]="item.stock === 0">
          
          <div class="position-absolute top-0 start-0 m-2 z-2">
             <span *ngIf="item.stock === 0" class="badge bg-secondary rounded-pill shadow-sm px-2 py-1" style="font-size: 0.65rem;">AGOTADO</span>
          </div>

          <div class="img-wrapper p-2 p-md-4 d-flex align-items-center justify-content-center bg-white cursor-pointer" [routerLink]="['/producto', item.slug || item.id]">
             <img [src]="item.imagen" class="img-fluid object-fit-contain product-img transition-transform" [class.grayscale]="item.stock === 0" alt="{{ item.nombre }}">
          </div>
          
          <div class="card-body p-2 p-md-3 d-flex flex-column border-top border-light">
            <div class="mb-1 mb-md-2">
               <small class="text-uppercase fw-bold text-muted d-block text-truncate" style="font-size: 0.65rem;">{{ item.marca || 'Fatahi' }}</small>
               <h6 class="card-title fw-bold text-dark mb-1 text-truncate-2 lh-sm cursor-pointer hover-text-primary product-title" [routerLink]="['/producto', item.slug || item.id]">
                   {{ item.nombre }}
               </h6>
            </div>
            
            <div class="mt-auto pt-1 pt-md-2">
              
              <div class="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between mb-2 mb-md-3">
                 <span class="fw-bold text-success product-price">S/ {{ (item.precioOferta || item.precio) | number:'1.2-2' }}</span>
                 
                 <span class="badge rounded-pill stock-badge mt-1 mt-xl-0" 
                       [class.bg-success-subtle]="(item.stock || 0) > 0" 
                       [class.text-success]="(item.stock || 0) > 0" 
                       [class.border]="(item.stock || 0) > 0"
                       [class.border-success]="(item.stock || 0) > 0"
                       [class.bg-secondary]="(item.stock || 0) === 0"
                       [class.text-white]="(item.stock || 0) === 0">
                   {{ (item.stock || 0) > 0 ? 'Stock: ' + item.stock : 'Agotado' }}
                 </span>
              </div>
              
              <a [href]="generarLinkWhatsapp(item)" target="_blank" class="btn w-100 rounded-pill fw-bold py-1 py-md-2 transition-all d-flex align-items-center justify-content-center gap-1 gap-md-2 text-white whatsapp-btn" 
                 [style.background-color]="item.stock === 0 ? '#6c757d' : '#25D366'"
                 [class.disabled]="item.stock === 0">
                <i class="bi bi-whatsapp"></i>
                <span class="d-none d-sm-inline">{{ (item.stock || 0) > 0 ? 'Consultar WhatsApp' : 'Sin Stock' }}</span>
                <span class="d-inline d-sm-none">{{ (item.stock || 0) > 0 ? 'Pedir' : 'Agotado' }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card { transition: all 0.3s ease; }
    .hover-card:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
    .product-img { transition: transform 0.3s ease; max-height: 100%; max-width: 100%; }
    .hover-card:hover .product-img { transform: scale(1.08); }
    .grayscale { filter: grayscale(100%); opacity: 0.5; }
    .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.4em; }
    .hover-text-primary:hover { color: #198754 !important; }

    /* ESTILOS RESPONSIVOS: Celular por defecto, PC en @media */
    .img-wrapper { height: 140px; }
    .product-title { font-size: 0.85rem; }
    .product-price { font-size: 1.1rem; }
    .stock-badge { font-size: 0.65rem; padding: 0.25rem 0.5rem; align-self: flex-start; }
    .whatsapp-btn { font-size: 0.85rem; }

    /* A partir de pantallas medianas (Tablets y PC) crecen los elementos */
    @media (min-width: 768px) {
      .img-wrapper { height: 220px; }
      .product-title { font-size: 1rem; }
      .product-price { font-size: 1.25rem; }
      .stock-badge { font-size: 0.75rem; align-self: auto; }
      .whatsapp-btn { font-size: 1rem; }
    }
  `]
})
export class ProductListComponent {
  storeService = inject(StoreService);

  // AQUÍ CAMBIAS EL NÚMERO DE TU MAMÁ
  numeroWhatsapp = '51921718961'; 

  generarLinkWhatsapp(producto: Producto): string {
    const mensaje = `Hola Fatahi, estoy interesado en el producto: *${producto.nombre}*. ¿Tienen stock disponible?`;
    return `https://wa.me/${this.numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
  }
}