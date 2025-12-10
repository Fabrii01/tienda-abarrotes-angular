import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <h2 class="fw-bold mb-4 text-danger"><i class="bi bi-heart-fill me-2"></i>Mis Favoritos</h2>

      <div *ngIf="misFavoritos().length === 0" class="text-center py-5 bg-light rounded">
        <i class="bi bi-heart-break display-1 text-muted"></i>
        <p class="mt-3 text-muted">Aún no tienes productos favoritos.</p>
        <a routerLink="/" class="btn btn-primary">Ir a vitrinear</a>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div class="col" *ngFor="let item of misFavoritos()">
          <div class="card h-100 border-0 shadow-sm">
            <img [src]="item.imagen" class="card-img-top p-3" style="height: 200px; object-fit: contain;">
            <div class="card-body">
              <h5 class="card-title text-truncate">{{ item.nombre }}</h5>
              <p class="card-text fw-bold text-success">S/ {{ item.precio | number:'1.2-2' }}</p>
              
              <div class="d-grid gap-2">
                <button class="btn btn-outline-danger btn-sm" (click)="quitar(item)">
                  <i class="bi bi-trash"></i> Quitar
                </button>
                <button class="btn btn-primary btn-sm" (click)="agregar(item)">
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FavoritesPageComponent {
  storeService = inject(StoreService);

  // COMPUTED: Filtramos los productos que están en la lista de favoritos
  misFavoritos = computed(() => {
    const todos = this.storeService.productos(); // Lista completa
    const idsFavoritos = this.storeService.favoritos(); // IDs guardados
    
    // Devolvemos solo los productos cuyo ID esté en la lista de favoritos
    return todos.filter(p => idsFavoritos.includes(p.id!.toString()));
  });

  quitar(producto: any) {
    this.storeService.toggleFavorito(producto);
  }

  agregar(producto: any) {
    this.storeService.agregarProducto(producto);
  }
}