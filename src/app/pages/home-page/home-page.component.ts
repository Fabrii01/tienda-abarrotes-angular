import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ProductListComponent, FormsModule],
  template: `
    <div class="bg-dark text-white py-5 position-relative overflow-hidden mb-4 shadow-sm">
      <div class="position-absolute top-0 start-0 w-100 h-100" 
           style="background: url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80') center/cover; opacity: 0.4;">
      </div>
      <div class="container position-relative z-1 py-5 text-center">
        <h1 class="display-4 fw-bold">Ofertas de Fin de Semana</h1>
        <p class="lead mb-4">Los mejores abarrotes frescos y al mejor precio.</p>
        <button class="btn btn-warning btn-lg fw-bold text-dark px-5" (click)="verOfertas()">
          Ver Ofertas
        </button>
      </div>
    </div>

    <div class="container-fluid px-4 pb-5">
      <div class="row">
        
        <div class="col-md-3 col-lg-2 mb-4"> <div class="card border-0 shadow-sm p-3 sticky-top" style="top: 90px; z-index: 1;">
            
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0"><i class="bi bi-sliders me-2"></i>Filtros</h5>
              <span *ngIf="storeService.soloOfertas()" class="badge bg-danger">Ofertas</span>
            </div>
            
            <div class="mb-4">
              <label class="fw-bold small text-muted mb-2">Categorías</label>
              <div class="list-group list-group-flush">
                <button class="list-group-item list-group-item-action py-2 small border-0 px-0"
                        [class.fw-bold]="storeService.categoriaSeleccionada() === 'Todos'"
                        [class.text-success]="storeService.categoriaSeleccionada() === 'Todos'"
                        (click)="storeService.cambiarCategoria('Todos')">
                  Todos
                </button>
                <button *ngFor="let c of storeService.categorias()" 
                        class="list-group-item list-group-item-action py-2 small border-0 px-0"
                        [class.fw-bold]="storeService.categoriaSeleccionada() === c.nombre"
                        [class.text-success]="storeService.categoriaSeleccionada() === c.nombre"
                        (click)="storeService.cambiarCategoria(c.nombre)">
                  {{ c.nombre }}
                </button>
              </div>
            </div>

            <hr class="text-muted">

            <div class="mb-4">
              <label class="fw-bold small text-muted mb-2">Precio Máximo</label>
              <div class="d-flex justify-content-between small fw-bold mb-2">
                <span>S/ {{ storeService.limitesPrecio().min }}</span>
                <span class="text-success fs-6">S/ {{ valorSlider }}</span> 
                <span>S/ {{ storeService.limitesPrecio().max }}</span>
              </div>
              <input type="range" class="form-range" step="1" 
                     [min]="storeService.limitesPrecio().min" 
                     [max]="storeService.limitesPrecio().max" 
                     [(ngModel)]="valorSlider"
                     (input)="actualizarPrecio()">
            </div>

            <hr class="text-muted">

            <div class="mb-4">
              <label class="fw-bold small text-muted mb-2">Marcas</label>
              <select class="form-select form-select-sm" 
                      [ngModel]="storeService.marcaSeleccionada()"
                      (ngModelChange)="storeService.marcaSeleccionada.set($event)">
                <option value="Todas">Todas</option>
                <option *ngFor="let m of storeService.marcas()" [value]="m.nombre">{{ m.nombre }}</option>
              </select>
            </div>

            <button class="btn btn-outline-secondary w-100 btn-sm" (click)="resetear()">
              Limpiar
            </button>

          </div>
        </div>

        <div class="col-md-9 col-lg-10"> <div class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border">
            <div>
              <h4 class="fw-bold mb-0 text-success">
                {{ storeService.soloOfertas() ? '🔥 Oportunidades Únicas' : storeService.categoriaSeleccionada() }}
              </h4>
              <small class="text-muted">{{ storeService.productosFiltrados().length }} resultados</small>
            </div>

            <div class="d-flex align-items-center gap-2">
              <label class="small text-muted text-nowrap">Ordenar:</label>
              <select class="form-select form-select-sm border-0 bg-light" 
                      [ngModel]="storeService.ordenarPor()" 
                      (ngModelChange)="storeService.ordenarPor.set($event)">
                <option value="defecto">Relevancia</option>
                <option value="barato">Menor Precio</option>
                <option value="caro">Mayor Precio</option>
                <option value="az">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          <app-product-list></app-product-list>

        </div>
      </div>
    </div>
  `
})
export class HomePageComponent {
  storeService = inject(StoreService);
  valorSlider: number = 9999;

  constructor() {
    effect(() => {
      const limites = this.storeService.limitesPrecio();
      const filtroActual = this.storeService.precioMaxSlider();
      if (filtroActual === null) {
        this.valorSlider = limites.max;
      }
    });
  }

  actualizarPrecio() {
    this.storeService.precioMaxSlider.set(this.valorSlider);
  }

  verOfertas() {
    this.storeService.activarSoloOfertas();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  resetear() {
    this.storeService.resetearFiltros();
  }
}