import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ProductListComponent, FormsModule],
  template: `
    <div class="position-relative overflow-hidden p-4 p-md-5 text-center bg-dark text-white mb-4 animate-fade-in mx-2 mx-md-4 rounded-4 mt-3 shadow-lg" 
         style="background-image: linear-gradient(to right, rgba(15, 81, 50, 0.8), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center; min-height: 350px; display: flex; align-items: center;">
      
      <div class="col-md-8 p-lg-4 mx-auto position-relative z-1 text-center text-md-start">
        <span class="badge bg-warning text-dark mb-3 fw-bold px-3 py-2 rounded-pill text-uppercase tracking-wide small shadow-sm">
          <i class="bi bi-stars me-1"></i> Nueva Colección
        </span>
        <h1 class="display-4 fw-bold mb-3 text-white">Novedades Fatahi</h1>
        <p class="lead fw-normal mb-4 text-white-50 mx-auto mx-md-0 fs-5" style="max-width: 600px;">
          Descubre nuestro catálogo exclusivo. Productos seleccionados de la mejor calidad, listos para ti.
        </p>
        <button class="btn btn-success btn-lg px-5 py-3 fw-bold shadow-lg hover-scale rounded-pill fs-6" (click)="verCatalogo()">
          Explorar Catálogo <i class="bi bi-arrow-down-circle ms-2"></i>
        </button>
      </div>
    </div>

    <div class="container-fluid px-3 px-lg-5 pb-5 mt-2">
      <div class="row g-4">
        
        <div class="col-md-3 col-xl-2 d-none d-md-block"> <div class="card border-0 shadow-sm p-4 sticky-top rounded-4 bg-white" style="top: 90px; z-index: 10;">
            
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-grid-fill me-2 text-success"></i>Categorías</h6>
            </div>
            
            <div class="mb-4">
              <div class="d-flex flex-column gap-2">
                <button class="btn text-start ps-3 py-2 rounded-3 d-flex justify-content-between align-items-center transition-all fw-medium border-0"
                        [class.bg-success]="storeService.categoriaSeleccionada() === 'Todos'"
                        [class.text-white]="storeService.categoriaSeleccionada() === 'Todos'"
                        [class.bg-light]="storeService.categoriaSeleccionada() !== 'Todos'"
                        [class.text-dark]="storeService.categoriaSeleccionada() !== 'Todos'"
                        (click)="storeService.cambiarCategoria('Todos')">
                   <span>Ver Todo</span>
                   <i class="bi bi-chevron-right small opacity-50" *ngIf="storeService.categoriaSeleccionada() === 'Todos'"></i>
                </button>
                
                <button *ngFor="let c of storeService.categorias()" 
                        class="btn text-start ps-3 py-2 rounded-3 d-flex justify-content-between align-items-center transition-all fw-medium border-0"
                        [class.bg-success]="storeService.categoriaSeleccionada() === c.nombre"
                        [class.text-white]="storeService.categoriaSeleccionada() === c.nombre"
                        [class.bg-light]="storeService.categoriaSeleccionada() !== c.nombre"
                        [class.text-dark]="storeService.categoriaSeleccionada() !== c.nombre"
                        (click)="storeService.cambiarCategoria(c.nombre)">
                  <span>{{ c.nombre }}</span>
                  <i class="bi bi-chevron-right small opacity-50" *ngIf="storeService.categoriaSeleccionada() === c.nombre"></i>
                </button>
              </div>
            </div>

          </div>
        </div>

        <div class="col-md-9 col-xl-10"> 
          
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-2 border-bottom">
            <h4 class="fw-bold mb-3 mb-sm-0 text-dark fs-4">
              {{ storeService.categoriaSeleccionada() === 'Todos' ? 'Catálogo Completo' : storeService.categoriaSeleccionada() }}
              <small class="text-muted fw-normal ms-2 fs-6">({{ storeService.productosFiltrados().length }} productos)</small>
            </h4>

            <div class="d-flex align-items-center gap-2">
              <label class="small text-muted fw-bold d-none d-sm-block text-uppercase" style="font-size: 0.7rem; letter-spacing: 1px;">Ordenar por:</label>
              <select class="form-select form-select-sm border-0 bg-white shadow-sm rounded-pill px-3 py-2 fw-medium" 
                      style="width: auto; cursor: pointer;"
                      [ngModel]="storeService.ordenarPor()" 
                      (ngModelChange)="storeService.ordenarPor.set($event)">
                <option value="defecto">Destacados</option>
                <option value="barato">Menor precio</option>
                <option value="caro">Mayor precio</option>
              </select>
            </div>
          </div>

          <div class="animate-fade-in" id="catalogo-section">
             <app-product-list></app-product-list>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .hover-scale:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important; }
    .transition-all { transition: all 0.2s ease; }
    .tracking-wide { letter-spacing: 1px; }
    /* Ajuste fino para pantallas muy grandes */
    @media (min-width: 1400px) {
      .container-fluid { padding-left: 5rem !important; padding-right: 5rem !important; }
    }
  `]
})
export class HomePageComponent {
  storeService = inject(StoreService);

  verCatalogo() {
    // Resetear filtros para mostrar todo al hacer clic en el botón principal
    this.storeService.resetearFiltros();
    // Bajar la pantalla suavemente hacia la sección de productos
    const element = document.getElementById('catalogo-section');
    if (element) {
      const yOffset = -100; // Un poco más arriba para que no lo tape la barra de navegación
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    } else {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }
}