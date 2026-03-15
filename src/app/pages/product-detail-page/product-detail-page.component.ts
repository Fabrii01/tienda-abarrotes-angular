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
          <div class="card border-0 shadow-sm p-5 text-center bg-white rounded-4 h-100 d-flex align-items-center justify-content-center overflow-hidden">
            <img [src]="producto()?.imagen" class="img-fluid object-fit-contain" style="max-height: 450px;" alt="{{ producto()?.nombre }}">
          </div>
        </div>

        <div class="col-md-6">
          <div class="ps-lg-3 d-flex flex-column h-100">
            
            <div class="mb-2">
              <span class="text-uppercase text-primary fw-bold small tracking-wide">{{ producto()?.marca || 'Fatahi' }}</span>
            </div>

            <h1 class="display-6 fw-bold mb-3 text-dark">{{ producto()?.nombre }}</h1>

            <div class="mb-4">
              <span class="display-4 fw-bold text-success">S/ {{ (producto()?.precioOferta || producto()?.precio) | number:'1.2-2' }}</span>
            </div>

            <p class="text-muted lead fs-6 mb-5 border-top pt-4" style="white-space: pre-line;">
              {{ producto()?.descripcion || 'Consulta más detalles sobre este producto enviándonos un mensaje.' }}
            </p>

            <div class="card bg-light border-0 p-4 rounded-4 mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-4">
                 <span class="fw-bold d-flex align-items-center gap-2" [class.text-success]="(producto()?.stock || 0) > 0" [class.text-danger]="(producto()?.stock || 0) === 0">
                    <i class="bi" [class.bi-check-circle-fill]="(producto()?.stock || 0) > 0" [class.bi-x-circle-fill]="(producto()?.stock || 0) === 0"></i>
                    {{ (producto()?.stock || 0) > 0 ? 'Disponible' : 'Agotado' }}
                 </span>
              </div>

              <div class="d-grid">
                 <a [href]="generarLinkWhatsapp()" target="_blank" class="btn btn-lg fw-bold rounded-pill shadow-sm hover-scale text-white d-flex align-items-center justify-content-center gap-2"
                    [style.background-color]="(producto()?.stock || 0) > 0 ? '#25D366' : '#6c757d'"
                    [class.disabled]="(producto()?.stock || 0) === 0">
                   <i class="bi bi-whatsapp fs-4"></i> Lo quiero por WhatsApp
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="spinner-border text-success" role="status"></div>
      </div>
    </ng-template>
  `,
  styles: [`
    .hover-scale:hover { transform: translateY(-2px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important; }
  `]
})
export class ProductDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  storeService = inject(StoreService);

  producto = signal<any>(null);
  numeroWhatsapp = '51921718961';

  constructor() {
    effect(() => {
      // Obtenemos el parámetro de la URL (que ahora siempre será un ID)
      const idProducto = this.route.snapshot.paramMap.get('slug'); 
      if (idProducto && this.storeService.productos().length > 0) {
        // CAMBIO PRINCIPAL: Busca estrictamente por p.id
        const encontrado = this.storeService.productos().find(p => p.id === idProducto);
        if (encontrado) this.producto.set(encontrado);
      }
    });
  }

  generarLinkWhatsapp(): string {
    const prod = this.producto();
    const mensaje = `Hola Fatahi, me interesa comprar: *${prod?.nombre}*. ¿Podemos coordinar?`;
    return `https://wa.me/${this.numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  irAlInicio(e: Event) { e.preventDefault(); this.router.navigate(['/']); }
}