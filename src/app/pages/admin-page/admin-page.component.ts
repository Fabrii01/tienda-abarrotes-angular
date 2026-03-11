import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // <--- Necesario para el botón de volver
import { StoreService } from '../../services/store.service';
import { ProductListAdminComponent } from '../../components/product-list-admin/product-list-admin.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductListAdminComponent],
  template: `
    <div class="d-flex" style="min-height: 100vh; background-color: #f4f6f8;">
      
      <div class="bg-dark text-white p-3 shadow-lg d-none d-md-flex flex-column" style="width: 260px; min-height: 100vh;">
          <div class="mb-5 mt-2 px-2">
             <h3 class="fw-bold mb-0">Fatahi<span class="text-success">.Admin</span></h3>
             <small class="text-white-50">Gestión de Catálogo</small>
          </div>
          
          <ul class="nav nav-pills flex-column mb-auto gap-2">
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer py-3 rounded-3" [class.bg-success]="vistaActual === 'productos'" (click)="vistaActual = 'productos'">
                <i class="bi bi-box-seam me-2"></i> Inventario & Stock
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer py-3 rounded-3" [class.bg-success]="vistaActual === 'nuevo-producto'" (click)="vistaActual = 'nuevo-producto'">
                <i class="bi bi-plus-circle me-2"></i> Agregar Producto
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer py-3 rounded-3" [class.bg-success]="vistaActual === 'configuracion'" (click)="vistaActual = 'configuracion'">
                <i class="bi bi-tags me-2"></i> Categorías
              </a>
            </li>
          </ul>

          <div class="mt-auto pt-3 border-top border-secondary">
             <a routerLink="/" class="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-2">
               <i class="bi bi-box-arrow-left"></i> Volver al Catálogo
             </a>
          </div>
      </div>

      <div class="flex-grow-1 p-3 p-md-4 overflow-auto" style="height: 100vh;">
        
        <div class="d-md-none mb-4">
           <a routerLink="/" class="btn btn-outline-dark w-100 mb-3 fw-bold border-2 d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-arrow-left"></i> Volver al Catálogo
           </a>
           
           <div class="d-flex gap-2 overflow-auto pb-2">
             <button class="btn btn-dark flex-shrink-0" [class.btn-success]="vistaActual === 'productos'" (click)="vistaActual = 'productos'">Inventario</button>
             <button class="btn btn-dark flex-shrink-0" [class.btn-success]="vistaActual === 'nuevo-producto'" (click)="vistaActual = 'nuevo-producto'">Nuevo Producto</button>
             <button class="btn btn-dark flex-shrink-0" [class.btn-success]="vistaActual === 'configuracion'" (click)="vistaActual = 'configuracion'">Categorías</button>
           </div>
        </div>

        <div *ngIf="vistaActual === 'productos'" class="animate-fade-in">
           <h2 class="fw-bold mb-4">Gestión de Inventario</h2>
           <app-product-list-admin></app-product-list-admin>
        </div>

        <div *ngIf="vistaActual === 'nuevo-producto'" class="animate-fade-in">
          <h2 class="fw-bold mb-4">Publicar Producto</h2>
          <div class="card border-0 shadow-sm p-4 bg-white rounded-4" style="max-width: 800px;">
            <form (ngSubmit)="onSubmit()">
                
                <div class="row mb-3">
                  <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <label class="fw-bold small text-muted">Nombre del Producto</label>
                    <input type="text" class="form-control" [(ngModel)]="nuevoProducto.nombre" name="nombre" required placeholder="Ej: Mermelada Casera">
                  </div>
                  
                  <div class="col-12 col-md-6">
                    <label class="fw-bold small text-muted">Marca (Opcional)</label>
                    <div class="input-group">
                      <select class="form-select" [(ngModel)]="nuevoProducto.marca" name="marca">
                        <option value="">-- Sin Marca --</option>
                        <option *ngFor="let m of storeService.marcas()" [value]="m.nombre">{{ m.nombre }}</option>
                      </select>
                      <button class="btn btn-outline-secondary" type="button" (click)="vistaActual = 'configuracion'"><i class="bi bi-plus"></i></button>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <label class="fw-bold small text-muted">Categoría</label>
                    <div class="input-group">
                      <select class="form-select" [(ngModel)]="nuevoProducto.categoria" name="categoria" required>
                        <option value="" disabled selected>Selecciona Categoría</option>
                        <option *ngFor="let c of storeService.categorias()" [value]="c.nombre">{{ c.nombre }}</option>
                      </select>
                      <button class="btn btn-outline-secondary" type="button" (click)="vistaActual = 'configuracion'"><i class="bi bi-plus"></i></button>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="fw-bold small text-muted">Stock Inicial</label>
                    <input type="number" class="form-control" [(ngModel)]="nuevoProducto.stock" name="stock" required min="0">
                  </div>
                </div>

                <div class="row mb-3 bg-light p-3 rounded-3 mx-0 border border-dashed">
                   <div class="col-6">
                      <label class="fw-bold small text-muted">Precio Real (S/)</label>
                      <input type="number" class="form-control fw-bold" [(ngModel)]="nuevoProducto.precio" name="precio" required step="0.10">
                   </div>
                   <div class="col-6">
                      <label class="fw-bold small text-danger">Precio Oferta (Opcional)</label>
                      <input type="number" class="form-control border-danger text-danger fw-bold" [(ngModel)]="nuevoProducto.precioOferta" name="precioOferta">
                   </div>
                </div>

                <div class="mb-3 p-3 border rounded-3 bg-light">
                   <label class="fw-bold small text-muted mb-2 d-block">Imagen del Producto (Pega un Link O sube una foto)</label>
                   <div class="row g-2 align-items-center">
                     <div class="col-md-6">
                       <input type="text" class="form-control" [(ngModel)]="nuevoProducto.imagen" name="imagen" placeholder="Pega el Link (URL) aquí...">
                     </div>
                     <div class="col-md-1 text-center fw-bold text-muted small">O</div>
                     <div class="col-md-5">
                       <input type="file" class="form-control form-control-sm" (change)="onFileSelected($event)" accept="image/*">
                     </div>
                   </div>
                </div>

                <div class="mb-4">
                   <label class="fw-bold small text-muted">Descripción</label>
                   <textarea class="form-control" rows="2" [(ngModel)]="nuevoProducto.descripcion" name="descripcion"></textarea>
                </div>

                <div class="card bg-light border-0 p-3 mb-4 rounded-3 animate-fade-in" *ngIf="nuevoProducto.nombre || imagenPrevia || nuevoProducto.imagen">
                   <h6 class="fw-bold text-muted small text-uppercase mb-2"><i class="bi bi-eye"></i> Vista Previa</h6>
                   <div class="d-flex align-items-center bg-white p-2 rounded shadow-sm border">
                      <img [src]="imagenPrevia || nuevoProducto.imagen || 'https://via.placeholder.com/150?text=Sin+Foto'" 
                           class="rounded me-3 border object-fit-contain bg-white" 
                           style="width: 60px; height: 60px;"
                           onerror="this.src='https://via.placeholder.com/150?text=Error'">
                      <div class="flex-grow-1">
                         <div class="fw-bold text-dark">{{ nuevoProducto.nombre || 'Nombre del producto' }}</div>
                         <div class="small text-muted">
                            <span class="badge bg-secondary me-1" *ngIf="nuevoProducto.marca">{{ nuevoProducto.marca }}</span>
                            {{ nuevoProducto.categoria || 'Sin categoría' }}
                         </div>
                      </div>
                      <div class="text-end px-3">
                         <div class="fw-bold text-success fs-5">S/ {{ (nuevoProducto.precioOferta || nuevoProducto.precio || 0) | number:'1.2-2' }}</div>
                         <div *ngIf="nuevoProducto.precioOferta" class="text-decoration-line-through text-muted small">S/ {{ nuevoProducto.precio }}</div>
                      </div>
                   </div>
                </div>

                <div class="d-grid">
                   <button type="submit" class="btn btn-success btn-lg fw-bold w-100 rounded-pill" [disabled]="subiendo">
                     <span *ngIf="subiendo" class="spinner-border spinner-border-sm me-2"></span>
                     <i *ngIf="!subiendo" class="bi bi-cloud-upload me-2"></i> 
                     {{ subiendo ? 'Guardando producto...' : 'Publicar Producto' }}
                   </button>
                </div>
            </form>
          </div>
        </div>

        <div *ngIf="vistaActual === 'configuracion'" class="animate-fade-in">
          <h2 class="fw-bold mb-4">Configuración del Catálogo</h2>
          <div class="row">
            <div class="col-12 col-lg-6 mb-4">
              <div class="card border-0 shadow-sm h-100 rounded-4">
                <div class="card-header bg-white fw-bold py-3">Categorías</div>
                <div class="card-body">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Nueva Categoría" [(ngModel)]="nuevaCat">
                    <button class="btn btn-success" (click)="agregar('categories', nuevaCat); nuevaCat = ''"><i class="bi bi-plus-lg"></i></button>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <span *ngFor="let c of storeService.categorias()" class="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                      {{ c.nombre }} <i class="bi bi-x-circle-fill text-danger cursor-pointer" (click)="borrar('categories', c.id)"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6 mb-4">
              <div class="card border-0 shadow-sm h-100 rounded-4">
                <div class="card-header bg-white fw-bold py-3">Marcas (Opcionales)</div>
                <div class="card-body">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Nueva Marca" [(ngModel)]="nuevaMarca">
                    <button class="btn btn-success" (click)="agregar('brands', nuevaMarca); nuevaMarca = ''"><i class="bi bi-plus-lg"></i></button>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <span *ngFor="let m of storeService.marcas()" class="badge bg-light text-dark border p-2 d-flex align-items-center gap-2">
                      {{ m.nombre }} <i class="bi bi-x-circle-fill text-danger cursor-pointer" (click)="borrar('brands', m.id)"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`.cursor-pointer { cursor: pointer; }`]
})
export class AdminPageComponent {
  storeService = inject(StoreService);
  vistaActual: 'nuevo-producto' | 'productos' | 'configuracion' = 'productos';

  nuevoProducto: any = { nombre: '', precio: 0, precioOferta: null, categoria: '', imagen: '', stock: 10, marca: '', descripcion: '' };
  nuevaCat = '';
  nuevaMarca = '';

  imagenPrevia: string | null = null;
  subiendo = false;

  cambiarVista(vista: any) { this.vistaActual = vista; }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 800000) { 
         alert("La imagen es muy pesada. Elige una de menos de 800KB para optimizar tu base de datos.");
         event.target.value = ''; 
         return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPrevia = e.target.result;
        this.nuevoProducto.imagen = this.imagenPrevia;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (!this.nuevoProducto.imagen && !this.imagenPrevia) {
      alert('Por favor agrega una URL o sube una imagen');
      return;
    }

    this.subiendo = true;

    try {
      await this.storeService.crearProducto(this.nuevoProducto);
      alert('¡Producto publicado con éxito!');
      
      this.nuevoProducto = { nombre: '', precio: 0, categoria: '', imagen: '', stock: 10, marca: '', descripcion: '' };
      this.imagenPrevia = null;
      this.vistaActual = 'productos';

    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear el producto.');
    } finally {
      this.subiendo = false;
    }
  }

  agregar(tipo: 'categories' | 'brands', valor: string) {
    if(valor) this.storeService.agregarOpcion(tipo, valor);
  }

  borrar(tipo: 'categories' | 'brands', id: string) {
    if(confirm('¿Borrar?')) this.storeService.borrarOpcion(tipo, id);
  }
}