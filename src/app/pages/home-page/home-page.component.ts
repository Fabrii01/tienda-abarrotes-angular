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
    <div class="position-relative overflow-hidden p-3 p-md-4 text-center bg-dark text-white mb-4 animate-fade-in mx-2 mx-md-4 rounded-4 mt-3 shadow-lg" 
         style="background-image: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop'); background-size: cover; background-position: center; min-height: 300px; display: flex; align-items: center;">
      
      <div class="col-md-8 p-lg-4 mx-auto position-relative z-1">
        <span class="badge bg-warning text-dark mb-2 fw-bold px-3 py-1 rounded-pill text-uppercase tracking-wide small">
          ✨ Ofertas de la Semana
        </span>
        <h1 class="display-5 fw-bold mb-2">Tu Mercado en Casa</h1>
        <p class="lead fw-normal mb-4 text-white-50 mx-auto fs-6" style="max-width: 500px;">
          Productos frescos y seleccionados con entrega rápida. Calidad premium garantizada.
        </p>
        <button class="btn btn-success btn-lg px-4 py-2 gap-2 fw-bold shadow hover-scale rounded-pill fs-6" (click)="verOfertas()">
          Ver Catálogo <i class="bi bi-arrow-right-circle ms-1"></i>
        </button>
      </div>
    </div>

    <div class="container-fluid px-3 px-lg-5 pb-5">
      <div class="row g-4">
        
        <div class="col-md-3 col-xl-2">
          <div class="card border-0 shadow-sm p-3 sticky-top rounded-4 bg-white" style="top: 90px; z-index: 10;">
            
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h6 class="fw-bold mb-0"><i class="bi bi-sliders me-2 text-primary"></i>Filtros</h6>
              <span *ngIf="storeService.soloOfertas()" class="badge bg-danger rounded-pill" style="font-size: 0.6rem;">Ofertas</span>
            </div>
            
            <div class="mb-3">
              <label class="fw-bold small text-muted text-uppercase mb-2 d-block" style="font-size: 0.7rem;">Categorías</label>
              <div class="d-flex flex-column gap-1">
                <button class="btn btn-sm text-start ps-2 py-1 rounded-3 d-flex justify-content-between align-items-center transition-all"
                        [class.btn-primary]="storeService.categoriaSeleccionada() === 'Todos'"
                        [class.btn-light]="storeService.categoriaSeleccionada() !== 'Todos'"
                        (click)="storeService.cambiarCategoria('Todos')">
                   <span class="small">Todos</span>
                </button>
                <button *ngFor="let c of storeService.categorias()" 
                        class="btn btn-sm text-start ps-2 py-1 rounded-3 d-flex justify-content-between align-items-center transition-all"
                        [class.btn-primary]="storeService.categoriaSeleccionada() === c.nombre"
                        [class.btn-light]="storeService.categoriaSeleccionada() !== c.nombre"
                        (click)="storeService.cambiarCategoria(c.nombre)">
                  <span class="small">{{ c.nombre }}</span>
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label class="fw-bold small text-muted text-uppercase mb-2 d-block" style="font-size: 0.7rem;">Precio Máximo</label>
              <div class="d-flex justify-content-between small fw-bold mb-1" style="font-size: 0.7rem;">
                <span class="text-muted">S/ {{ storeService.limitesPrecio().min }}</span>
                <span class="text-primary">S/ {{ valorSlider }}</span> 
              </div>
              <input type="range" class="form-range form-range-sm" step="1" 
                     [min]="storeService.limitesPrecio().min" 
                     [max]="storeService.limitesPrecio().max" 
                     [(ngModel)]="valorSlider"
                     (input)="actualizarPrecio()">
            </div>

            <button class="btn btn-outline-dark w-100 rounded-pill py-1 btn-sm fw-bold" (click)="resetear()">
              Limpiar
            </button>
          </div>
        </div>

        <div class="col-md-9 col-xl-10"> 
          
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h4 class="fw-bold mb-2 mb-sm-0 text-dark fs-5">
              {{ storeService.soloOfertas() ? '🔥 Ofertas Especiales' : storeService.categoriaSeleccionada() }}
              <small class="text-muted fw-normal ms-2 fs-6">({{ storeService.productosFiltrados().length }})</small>
            </h4>

            <div class="d-flex align-items-center gap-2">
              <label class="small text-muted d-none d-sm-block">Ordenar:</label>
              <select class="form-select form-select-sm border-0 bg-white shadow-sm rounded-pill px-3" 
                      style="width: auto;"
                      [ngModel]="storeService.ordenarPor()" 
                      (ngModelChange)="storeService.ordenarPor.set($event)">
                <option value="defecto">Relevancia</option>
                <option value="barato">Precio: Bajo a Alto</option>
                <option value="caro">Precio: Alto a Bajo</option>
              </select>
            </div>
          </div>

          <div class="animate-fade-in">
             <app-product-list></app-product-list>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-scale:hover { transform: scale(1.02); }
    .transition-all { transition: all 0.2s ease; }
    /* Ajuste fino para pantallas muy grandes */
    @media (min-width: 1400px) {
      .container-fluid { padding-left: 8rem !important; padding-right: 8rem !important; }
    }
  `]
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
    this.storeService.actualizarFiltroPrecio(this.valorSlider);
  }

  verOfertas() {
    this.storeService.activarSoloOfertas();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  resetear() {
    this.storeService.resetearFiltros();
  }
}