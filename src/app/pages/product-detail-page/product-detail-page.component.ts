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
    <div class="container py-5" *ngIf="producto(); else loadingTemplate">
      
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" class="text-decoration-none text-muted" (click)="irAlInicio($event)">Inicio</a></li>
          <li class="breadcrumb-item active text-dark" aria-current="page">{{ producto()?.nombre }}</li>
        </ol>
      </nav>

      <div class="row g-5">
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm p-4 text-center bg-white h-100 d-flex align-items-center justify-content-center">
            <img [src]="producto()?.imagen" class="img-fluid" style="max-height: 400px; object-fit: contain;">
          </div>
        </div>

        <div class="col-md-6">
          
          <div class="mb-2">
            <span class="badge bg-light text-dark border me-2">{{ producto()?.categoria }}</span>
            <span class="text-muted small fw-bold text-uppercase">{{ producto()?.marca || 'Genérico' }}</span>
          </div>

          <h1 class="fw-bold mb-3">{{ producto()?.nombre }}</h1>

          <div class="mb-4">
            <div *ngIf="tieneOferta()">
              <span class="display-5 fw-bold text-danger">S/ {{ producto()?.precioOferta | number:'1.2-2' }}</span>
              <span class="text-muted text-decoration-line-through ms-3 fs-5">S/ {{ producto()?.precio | number:'1.2-2' }}</span>
              <span class="badge bg-danger ms-2 align-top">-{{ calcularDescuento() }}%</span>
            </div>
            <div *ngIf="!tieneOferta()">
              <span class="display-5 fw-bold text-dark">S/ {{ producto()?.precio | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="card bg-light border-0 p-4 mb-4">
            
            <div class="mb-3">
              <span class="fw-bold" 
                    [class.text-success]="(producto()?.stock || 0) > 5" 
                    [class.text-danger]="(producto()?.stock || 0) === 0">
                <i class="bi" [class.bi-check-circle-fill]="(producto()?.stock || 0) > 0" [class.bi-x-circle-fill]="(producto()?.stock || 0) === 0"></i>
                Stock: {{ producto()?.stock || 0 }}
              </span>
            </div>

            <div class="d-flex gap-3 align-items-center mb-3">
              <label class="fw-bold small">Cantidad:</label>
              <div class="input-group" style="width: 140px;">
                <button class="btn btn-outline-secondary" (click)="cambiarCantidad(-1)" [disabled]="cantidad <= 1">-</button>
                <input type="text" class="form-control text-center bg-white" [value]="cantidad" readonly>
                <button class="btn btn-outline-secondary" (click)="cambiarCantidad(1)">+</button>
              </div>
            </div>

            <button class="btn w-100 py-3 fw-bold fs-5 shadow-sm" 
                    [class.btn-warning]="(producto()?.stock || 0) > 0"
                    [class.btn-secondary]="(producto()?.stock || 0) === 0"
                    (click)="agregarAlCarrito()">
              <i class="bi bi-cart-plus-fill me-2"></i> 
              {{ (producto()?.stock || 0) > 0 ? 'AGREGAR AL CARRITO' : 'SIN STOCK' }}
            </button>
          </div>

          <div class="mb-4">
            <h5 class="fw-bold border-bottom pb-2">Descripción</h5>
            <p class="text-muted" style="white-space: pre-line;">
              {{ producto()?.descripcion || 'Sin descripción detallada.' }}
            </p>
          </div>

        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Cargando producto...</p>
      </div>
    </ng-template>
  `
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  storeService = inject(StoreService);

  producto = signal<any>(null);
  cantidad = 1;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) this.buscarProducto(slug);
    });

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
    // Permitimos subir la cantidad visualmente, pero al comprar validaremos
    const nuevaCantidad = this.cantidad + val;
    if (nuevaCantidad >= 1) {
      this.cantidad = nuevaCantidad;
    }
  }

  agregarAlCarrito() {
    const prod = this.producto();

    // 1. Validaciones
    if (!prod || !prod.stock || prod.stock === 0) {
      alert('Excede el número de stock');
      return; 
    }
    if (this.cantidad > prod.stock) {
      alert(`Excede el número de stock (Máximo: ${prod.stock})`);
      return;
    }
    
    // 2. AGREGAR AL SERVICIO (Una sola llamada con la cantidad)
    this.storeService.agregarProducto(prod, this.cantidad);
    
    // 3. FEEDBACK (Sin redirección)
    alert(`¡Se agregaron ${this.cantidad} unidades al carrito!`);
    
    // ELIMINAMOS ESTA LÍNEA:
    // this.router.navigate(['/carrito']); 
  }

  tieneOferta(): boolean {
    const p = this.producto();
    return p?.precioOferta && p.precioOferta < p.precio;
  }

  calcularDescuento(): number {
    const p = this.producto();
    return Math.round((1 - (p.precioOferta / p.precio)) * 100);
  }

  irAlInicio(e: Event) {
    e.preventDefault();
    this.router.navigate(['/']);
  }
}