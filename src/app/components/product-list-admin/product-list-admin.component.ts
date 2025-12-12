import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-product-list-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold"><i class="bi bi-box-seam me-2"></i>Inventario Total</h5>
        <span class="badge bg-primary">{{ storeService.productos().length }} Productos</span>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Producto</th>
              <th>Precios</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Creado Por</th> 
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of storeService.productos()">
              <td>
                <div class="d-flex align-items-center">
                  <img [src]="p.imagen" class="rounded me-2 bg-light border" style="width: 40px; height: 40px; object-fit: contain;">
                  <div class="d-flex flex-column">
                    <span class="fw-bold">{{ p.nombre }}</span>
                    <small class="text-muted" *ngIf="p.marca">{{ p.marca }}</small> 
                  </div>
                </div>
              </td>
              <td>
                <div *ngIf="p.precioOferta && p.precioOferta < p.precio">
                  <span class="text-danger fw-bold">S/ {{ p.precioOferta | number:'1.2-2' }}</span><br>
                  <small class="text-decoration-line-through text-muted">S/ {{ p.precio | number:'1.2-2' }}</small>
                </div>
                <div *ngIf="!p.precioOferta || p.precioOferta >= p.precio">
                  S/ {{ p.precio | number:'1.2-2' }}
                </div>
              </td>
              <td>
                <span class="badge" 
                      [class.bg-success]="(p.stock || 0) > 5" 
                      [class.bg-warning]="(p.stock || 0) > 0 && (p.stock || 0) <= 5"
                      [class.bg-danger]="(p.stock || 0) === 0">
                  {{ p.stock || 0 }} un.
                </span>
              </td>
              <td><span class="badge bg-light text-dark border">{{ p.categoria }}</span></td>
              <td class="small text-muted"><i class="bi bi-person-fill"></i> {{ p.creadorEmail || 'Desconocido' }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" (click)="editar(p)" data-bs-toggle="modal" data-bs-target="#editProductModal">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="borrar(p)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="editProductModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Editar Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" *ngIf="productoEditando.id">
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="fw-bold small">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="productoEditando.nombre">
              </div>
              
              <div class="col-md-6">
                <label class="fw-bold small">Marca</label>
                <select class="form-select" [(ngModel)]="productoEditando.marca">
                   <option [value]="productoEditando.marca" hidden>{{ productoEditando.marca }}</option>
                   <option *ngFor="let m of storeService.marcas()" [value]="m.nombre">{{ m.nombre }}</option>
                </select>
              </div>
            </div>

            <div class="row mb-3 bg-light p-2 mx-0 rounded border">
               <div class="col-md-6">
                 <label class="fw-bold small">Precio Real</label>
                 <input type="number" class="form-control" [(ngModel)]="productoEditando.precio">
               </div>
               <div class="col-md-6">
                 <label class="fw-bold small text-danger">Precio Oferta</label>
                 <input type="number" class="form-control border-danger" [(ngModel)]="productoEditando.precioOferta">
               </div>
            </div>

            <div class="row mb-3">
               <div class="col-md-6">
                 <label class="fw-bold small">Categoría</label>
                 <select class="form-select" [(ngModel)]="productoEditando.categoria">
                    <option [value]="productoEditando.categoria" hidden>{{ productoEditando.categoria }}</option>
                    <option *ngFor="let c of storeService.categorias()" [value]="c.nombre">{{ c.nombre }}</option>
                 </select>
               </div>
               
               <div class="col-md-6">
                 <label class="fw-bold small">Stock</label>
                 <input type="number" class="form-control" [(ngModel)]="productoEditando.stock">
               </div>
            </div>

            <div class="mb-3">
              <label class="fw-bold small">Imagen URL</label>
              <input type="text" class="form-control" [(ngModel)]="productoEditando.imagen">
            </div>
            
            <div class="mb-3">
              <label class="fw-bold small">Descripción</label>
              <textarea class="form-control" rows="2" [(ngModel)]="productoEditando.descripcion"></textarea>
            </div>

            <button class="btn btn-success w-100 fw-bold" data-bs-dismiss="modal" (click)="guardarCambios()">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListAdminComponent {
  storeService = inject(StoreService);
  
  productoEditando: any = {}; 

  borrar(p: Producto) {
    if(p.id && confirm(`¿Borrar ${p.nombre}?`)) {
      this.storeService.borrarProducto(p.id);
    }
  }

  editar(p: Producto) {
    this.productoEditando = { ...p }; 
  }

  async guardarCambios() {
    if (this.productoEditando.id) {
      await this.storeService.actualizarProducto(this.productoEditando.id, this.productoEditando);
    }
  }
}