import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5 animate-fade-in" *ngIf="producto(); else loadingTemplate">
      
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb small">
          <li class="breadcrumb-item"><a href="#" class="text-decoration-none text-muted hover-underline" (click)="irAlInicio($event)">Inicio</a></li>
          <li class="breadcrumb-item text-muted">{{ producto()?.categoria }}</li>
          <li class="breadcrumb-item active fw-bold text-dark" aria-current="page">{{ producto()?.nombre }}</li>
        </ol>
      </nav>

      <div class="row g-5">
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm p-5 text-center bg-white rounded-4 h-100 d-flex align-items-center justify-content-center position-relative overflow-hidden group-hover-zoom">
            <span *ngIf="tieneOferta()" class="position-absolute top-0 start-0 m-4 badge bg-danger fs-6 px-3 py-2 rounded-pill shadow-sm z-2">
              <i class="bi bi-tag-fill me-1"></i> -{{ calcularDescuento() }}% OFF
            </span>
            <img [src]="producto()?.imagen" class="img-fluid object-fit-contain zoom-img" style="max-height: 450px;" alt="{{ producto()?.nombre }}">
          </div>
        </div>

        <div class="col-md-6">
          <div class="ps-lg-3 d-flex flex-column h-100">
            
            <div class="mb-2">
              <span class="text-uppercase text-primary fw-bold small tracking-wide">{{ producto()?.marca || 'Genérico' }}</span>
            </div>

            <h1 class="display-6 fw-bold mb-3 text-dark">{{ producto()?.nombre }}</h1>

            <div class="mb-4 d-flex align-items-center">
               <div class="text-warning small me-2">
                 <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
               </div>
               <span class="text-muted small border-start ps-2">4.8 (Reseñas verificadas)</span>
            </div>

            <div class="mb-4">
              <div *ngIf="tieneOferta()" class="d-flex align-items-end gap-3">
                 <span class="display-4 fw-bold text-danger">S/ {{ producto()?.precioOferta | number:'1.2-2' }}</span>
                 <div class="d-flex flex-column">
                    <span class="text-decoration-line-through text-muted">S/ {{ producto()?.precio | number:'1.2-2' }}</span>
                    <span class="badge bg-success bg-opacity-10 text-success border border-success">Ahorras S/ {{ (producto().precio - producto().precioOferta) | number:'1.2-2' }}</span>
                 </div>
              </div>
              <div *ngIf="!tieneOferta()">
                <span class="display-4 fw-bold text-dark">S/ {{ producto()?.precio | number:'1.2-2' }}</span>
              </div>
              <div class="small text-muted mt-2 d-flex align-items-center gap-2">
                 <i class="bi bi-credit-card"></i> Paga con Tarjeta, Yape o Plin
              </div>
            </div>

            <p class="text-muted lead fs-6 mb-5 border-top pt-4">
              {{ producto()?.descripcion || 'Producto de alta calidad seleccionado especialmente para ti. Garantía de frescura y satisfacción.' }}
            </p>

            <div class="card bg-light border-0 p-4 rounded-4 mt-auto">
              
              <div class="d-flex justify-content-between align-items-center mb-3">
                 <span class="fw-bold d-flex align-items-center gap-2" 
                       [class.text-success]="(producto()?.stock || 0) > 5" 
                       [class.text-warning]="(producto()?.stock || 0) <= 5 && (producto()?.stock || 0) > 0"
                       [class.text-danger]="(producto()?.stock || 0) === 0">
                    <i class="bi" [class.bi-check-circle-fill]="(producto()?.stock || 0) > 0" [class.bi-x-circle-fill]="(producto()?.stock || 0) === 0"></i>
                    {{ (producto()?.stock || 0) > 0 ? 'Disponible en Stock' : 'Agotado Temporalmente' }}
                 </span>
                 <span class="text-muted small" *ngIf="(producto()?.stock || 0) > 0">Quedan {{ producto()?.stock }}</span>
              </div>

              <div class="row g-2">
                <div class="col-4">
                   <div class="input-group bg-white rounded-3 overflow-hidden border">
                      <button class="btn btn-light border-0 px-2" (click)="cambiarCantidad(-1)" [disabled]="cantidad <= 1"><i class="bi bi-dash"></i></button>
                      <input type="text" class="form-control text-center border-0 fw-bold bg-white p-0" [value]="cantidad" readonly>
                      <button class="btn btn-light border-0 px-2" (click)="cambiarCantidad(1)"><i class="bi bi-plus"></i></button>
                   </div>
                </div>
                <div class="col-8">
                   <button class="btn btn-dark w-100 fw-bold py-2 rounded-3 shadow-sm hover-scale" 
                          [class.btn-dark]="(producto()?.stock || 0) > 0"
                          [class.btn-secondary]="(producto()?.stock || 0) === 0"
                          [disabled]="(producto()?.stock || 0) === 0"
                          (click)="agregarAlCarrito()">
                     <i class="bi bi-bag-plus me-2"></i> Agregar al Carrito
                   </button>
                </div>
              </div>
            </div>

            <div class="row g-3 mt-3 small text-muted">
               <div class="col-6 d-flex align-items-center gap-2">
                 <div class="bg-white p-2 rounded-circle shadow-sm text-primary"><i class="bi bi-truck"></i></div>
                 <span>Envío a todo el país</span>
               </div>
               <div class="col-6 d-flex align-items-center gap-2">
                 <div class="bg-white p-2 rounded-circle shadow-sm text-success"><i class="bi bi-shield-check"></i></div>
                 <span>Compra 100% Segura</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="spinner-grow text-success" role="status"></div>
      </div>
    </ng-template>
  `,
  styles: [`
    .hover-underline:hover { text-decoration: underline !important; }
    .tracking-wide { letter-spacing: 1px; }
    .zoom-img { transition: transform 0.4s ease; }
    .card:hover .zoom-img { transform: scale(1.1); }
    .hover-scale:hover { transform: translateY(-2px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important; }
  `]
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  storeService = inject(StoreService);

  producto = signal<any>(null);
  cantidad = 1;

  constructor() {
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('slug');
      if (slug && this.storeService.productos().length > 0) {
        this.buscarProducto(slug);
      }
    });
  }

  buscarProducto(termino: string) {
    const encontrado = this.storeService.productos().find(p => p.slug === termino || p.id === termino);
    if (encontrado) {
      this.producto.set(encontrado);
      this.cantidad = 1; 
    }
  }

  cambiarCantidad(val: number) {
    const nuevaCantidad = this.cantidad + val;
    if (nuevaCantidad >= 1) this.cantidad = nuevaCantidad;
  }

  agregarAlCarrito() {
    const prod = this.producto();
    if (!prod || !prod.stock) return;
    if (this.cantidad > prod.stock) { alert('Stock insuficiente'); return; }
    
    this.storeService.agregarProducto(prod, this.cantidad);
    alert('¡Agregado al carrito!');
  }

  tieneOferta(): boolean { return !!this.producto()?.precioOferta && this.producto()?.precioOferta < this.producto()?.precio; }
  calcularDescuento(): number { return Math.round((1 - (this.producto().precioOferta / this.producto().precio)) * 100); }
  irAlInicio(e: Event) { e.preventDefault(); this.router.navigate(['/']); }
}