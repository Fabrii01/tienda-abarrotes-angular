import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5 animate-fade-in">
      
      <div class="d-flex align-items-center gap-3 mb-5 border-bottom pb-3">
        <h2 class="fw-bold mb-0 text-dark">Mis Favoritos</h2>
        <span class="badge bg-danger rounded-pill">{{ misFavoritos().length }} productos</span>
      </div>

      <div *ngIf="misFavoritos().length === 0" class="text-center py-5">
        <div class="mb-4">
           <i class="bi bi-heartbreak display-1 text-muted opacity-25"></i>
        </div>
        <h4 class="fw-bold text-dark">Tu lista de deseos está vacía</h4>
        <p class="text-muted mb-4">Parece que aún no te has enamorado de ningún producto.</p>
        <a routerLink="/" class="btn btn-dark btn-lg rounded-pill px-5 shadow-sm fw-bold hover-scale">
          Explorar Productos
        </a>
      </div>

      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" *ngIf="misFavoritos().length > 0">
        
        <div class="col" *ngFor="let item of misFavoritos()">
          <div class="card h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden position-relative bg-white">
            
            <button class="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3 p-2 z-2 d-flex align-items-center justify-content-center text-danger hover-bg-danger" 
                    style="width: 35px; height: 35px;"
                    title="Eliminar de favoritos"
                    (click)="quitar(item)"> 
               <i class="bi bi-trash3-fill" style="font-size: 1rem;"></i>
            </button>

            <div class="p-4 d-flex align-items-center justify-content-center bg-white cursor-pointer" 
                 style="height: 200px;"
                 [routerLink]="['/producto', item.slug || item.id]">
               <img [src]="item.imagen" class="img-fluid object-fit-contain product-img transition-transform" 
                    style="max-height: 100%; max-width: 100%;" 
                    alt="{{ item.nombre }}">
            </div>
            
            <div class="card-body p-3 d-flex flex-column border-top border-light">
              
              <div class="mb-2">
                 <small class="text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">{{ item.marca }}</small>
                 <h6 class="card-title fw-bold text-dark mb-1 text-truncate cursor-pointer"
                     [routerLink]="['/producto', item.slug || item.id]">
                     {{ item.nombre }}
                 </h6>
              </div>
              
              <div class="mb-3">
                 <div *ngIf="item.precioOferta && item.precioOferta < item.precio" class="d-flex align-items-baseline gap-2">
                    <span class="fw-bold text-danger fs-5">S/ {{ item.precioOferta | number:'1.2-2' }}</span>
                    <small class="text-decoration-line-through text-muted small">S/ {{ item.precio | number:'1.2-2' }}</small>
                 </div>
                 <div *ngIf="!item.precioOferta || item.precioOferta >= item.precio">
                    <span class="fw-bold text-dark fs-5">S/ {{ item.precio | number:'1.2-2' }}</span>
                 </div>
              </div>
              
              <div class="mt-auto">
                <button class="btn btn-dark w-100 rounded-pill fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                        (click)="agregar(item)">
                  <i class="bi bi-cart-plus"></i> Agregar
                </button>
              </div>

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
    .hover-card:hover .product-img { transform: scale(1.05); }
    .hover-scale:hover { transform: scale(1.05); }
    .cursor-pointer { cursor: pointer; }
    .hover-bg-danger:hover { background-color: #dc3545 !important; color: white !important; }
  `]
})
export class FavoritesPageComponent {
  storeService = inject(StoreService);

  // COMPUTED: Filtramos los productos que están en la lista de favoritos
  misFavoritos = computed(() => {
    const todos = this.storeService.productos(); // Lista completa
    const idsFavoritos = this.storeService.favoritos(); // IDs guardados
    // Devolvemos solo los productos cuyo ID esté en la lista
    return todos.filter(p => idsFavoritos.includes(p.id!.toString()));
  });

  quitar(producto: any) {
    if(confirm('¿Quitar de favoritos?')) {
      this.storeService.toggleFavorito(producto);
    }
  }

  agregar(producto: any) {
    this.storeService.agregarProducto(producto);
    // Opcional: Podrías querer quitarlo de favoritos al agregarlo al carrito, 
    // pero usualmente se deja por si quiere comprarlo de nuevo en el futuro.
  }
}