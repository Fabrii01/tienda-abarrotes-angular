import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-product-list-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      
      <div class="card-header bg-white py-3 border-bottom-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <h5 class="mb-0 fw-bold d-flex align-items-center">
           <div class="bg-success text-white rounded p-2 me-2 shadow-sm d-flex"><i class="bi bi-box-seam"></i></div>
           Catálogo Fatahi
           <span class="badge bg-light text-dark border ms-2 rounded-pill">{{ storeService.productos().length }} Items</span>
        </h5>
        
        <div class="input-group input-group-sm" style="max-width: 250px;">
           <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
           <input type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Buscar producto..." [(ngModel)]="filtroTexto">
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0 text-nowrap">
          <thead class="table-light text-muted small text-uppercase">
            <tr>
              <th class="ps-4">Producto</th>
              <th>Precios (S/)</th>
              <th>Stock Rápido</th>
              <th>Categoría</th>
              <th class="text-end pe-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of productosFiltrados()">
              
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <img [src]="p.imagen" class="rounded me-3 bg-white border object-fit-contain shadow-sm" style="width: 45px; height: 45px;" onerror="this.src='https://via.placeholder.com/45?text=?'">
                  <div class="d-flex flex-column">
                    <span class="fw-bold text-dark text-truncate" style="max-width: 200px;">{{ p.nombre }}</span>
                    <small class="text-muted" *ngIf="p.marca">{{ p.marca }}</small> 
                  </div>
                </div>
              </td>
              
              <td>
                <div *ngIf="p.precioOferta && p.precioOferta < p.precio">
                  <span class="text-success fw-bold">{{ p.precioOferta | number:'1.2-2' }}</span><br>
                  <small class="text-decoration-line-through text-muted" style="font-size: 0.75rem;">{{ p.precio | number:'1.2-2' }}</small>
                </div>
                <div *ngIf="!p.precioOferta || p.precioOferta >= p.precio" class="fw-medium text-dark">
                  {{ p.precio | number:'1.2-2' }}
                </div>
              </td>
              
              <td>
                 <div class="input-group input-group-sm" style="width: 110px;">
                    <button class="btn btn-outline-secondary" (click)="cambiarStock(p, -1)" [disabled]="(p.stock || 0) <= 0">-</button>
                    <input type="text" class="form-control text-center fw-bold" 
                           [class.text-danger]="(p.stock || 0) === 0"
                           [value]="p.stock || 0" readonly>
                    <button class="btn btn-outline-secondary" (click)="cambiarStock(p, 1)">+</button>
                 </div>
              </td>
              
              <td><span class="badge bg-light text-dark border px-2 py-1">{{ p.categoria }}</span></td>
              
              <td class="text-end pe-4">
                <button class="btn btn-sm btn-light border shadow-sm text-primary me-2 hover-scale" (click)="editar(p)" data-bs-toggle="modal" data-bs-target="#editProductModal" title="Editar">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-light border shadow-sm text-danger hover-scale" (click)="borrar(p)" title="Eliminar">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>

            <tr *ngIf="productosFiltrados().length === 0">
               <td colspan="5" class="text-center py-4 text-muted">
                  No se encontraron productos.
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="editProductModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg"> 
        <div class="modal-content rounded-4 border-0 shadow-lg">
          <div class="modal-header border-bottom-0 pb-0">
            <h4 class="modal-title fw-bold text-dark">Editar Producto</h4>
            <button type="button" class="btn-close bg-light rounded-circle p-2" data-bs-dismiss="modal"></button>
          </div>
          
          <div class="modal-body p-4" *ngIf="productoEditando.id">
            
            <div class="d-flex align-items-center mb-4 bg-light p-3 rounded-3 border">
               <img [src]="productoEditando.imagen" class="rounded border bg-white me-3 object-fit-contain shadow-sm" style="width: 70px; height: 70px;">
               <div>
                  <h6 class="fw-bold mb-0 text-dark">{{ productoEditando.nombre }}</h6>
                  <span class="badge bg-success mt-1">Stock: {{ productoEditando.stock }}</span>
               </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="fw-bold small text-muted mb-1">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="productoEditando.nombre">
              </div>
              
              <div class="col-md-6">
                <label class="fw-bold small text-muted mb-1">Categoría</label>
                <div class="input-group">
                  <select class="form-select" [(ngModel)]="productoEditando.categoria">
                     <option *ngFor="let c of storeService.categorias()" [value]="c.nombre">{{ c.nombre }}</option>
                  </select>
                  <button class="btn btn-outline-secondary" type="button" (click)="agregarRapido('categories')" title="Añadir Categoría">
                    <i class="bi bi-plus-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-3">
               <label class="fw-bold small text-muted mb-1">Marca (Opcional)</label>
               <div class="input-group">
                 <select class="form-select" [(ngModel)]="productoEditando.marca">
                    <option value="">-- Sin Marca --</option>
                    <option *ngFor="let m of storeService.marcas()" [value]="m.nombre">{{ m.nombre }}</option>
                 </select>
                 <button class="btn btn-outline-secondary" type="button" (click)="agregarRapido('brands')" title="Añadir Marca">
                   <i class="bi bi-plus-lg"></i>
                 </button>
               </div>
            </div>

            <div class="row g-3 mb-4 bg-light p-2 mx-0 rounded-3 border border-dashed">
               <div class="col-md-6">
                 <label class="fw-bold small text-muted mb-1">Precio Normal (S/)</label>
                 <input type="number" class="form-control fw-bold" [(ngModel)]="productoEditando.precio">
               </div>
               <div class="col-md-6">
                 <label class="fw-bold small text-danger mb-1">Precio Oferta (S/)</label>
                 <input type="number" class="form-control border-danger text-danger fw-bold" [(ngModel)]="productoEditando.precioOferta" placeholder="Dejar vacío si no hay oferta">
               </div>
            </div>

            <div class="mb-4">
               <label class="fw-bold small text-muted mb-1">Descripción</label>
               <textarea class="form-control" rows="2" [(ngModel)]="productoEditando.descripcion"></textarea>
            </div>

            <button class="btn btn-dark w-100 fw-bold py-3 rounded-pill shadow-sm hover-scale" data-bs-dismiss="modal" (click)="guardarCambios()">
              <i class="bi bi-save me-2"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-scale { transition: transform 0.2s ease; }
    .hover-scale:hover { transform: translateY(-2px); }
  `]
})
export class ProductListAdminComponent {
  storeService = inject(StoreService);
  
  productoEditando: any = {}; 
  filtroTexto = '';

  productosFiltrados = computed(() => {
    const texto = this.filtroTexto.toLowerCase();
    const todos = this.storeService.productos();
    if (!texto) return todos;
    return todos.filter(p => p.nombre.toLowerCase().includes(texto) || (p.marca && p.marca.toLowerCase().includes(texto)));
  });

  borrar(p: Producto) {
    if(p.id && confirm(`¿Estás seguro de borrar "${p.nombre}" del catálogo?`)) {
      this.storeService.borrarProducto(p.id);
    }
  }

  editar(p: Producto) {
    this.productoEditando = { ...p }; 
  }

  async guardarCambios() {
    if (this.productoEditando.id) {
      if (this.productoEditando.precioOferta === '' || this.productoEditando.precioOferta === null) {
         delete this.productoEditando.precioOferta;
      }
      await this.storeService.actualizarProducto(this.productoEditando.id, this.productoEditando);
    }
  }

  async cambiarStock(p: Producto, cantidad: number) {
    if (p.id) {
      const nuevoStock = (p.stock || 0) + cantidad;
      if (nuevoStock >= 0) {
         await this.storeService.actualizarProducto(p.id, { ...p, stock: nuevoStock });
      }
    }
  }

  // --- NUEVA FUNCIÓN: Agregar marca o categoría sin salir del modal ---
  agregarRapido(tipo: 'categories' | 'brands') {
    const nombreItem = tipo === 'categories' ? 'Categoría' : 'Marca';
    const nuevoValor = prompt(`Ingresa el nombre de la nueva ${nombreItem}:`);
    
    if (nuevoValor && nuevoValor.trim() !== '') {
      const valorLimpio = nuevoValor.trim();
      this.storeService.agregarOpcion(tipo, valorLimpio);
      
      // Auto-seleccionar el nuevo valor en el formulario que se está editando
      if (tipo === 'categories') {
        this.productoEditando.categoria = valorLimpio;
      } else {
        this.productoEditando.marca = valorLimpio;
      }
    }
  }
}