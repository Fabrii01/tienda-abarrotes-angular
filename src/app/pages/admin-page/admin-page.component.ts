import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ProductListAdminComponent } from '../../components/product-list-admin/product-list-admin.component';
import { OrderListAdminComponent } from '../../components/order-list-admin/order-list-admin.component';
import { DashboardAdminComponent } from '../../components/dashboard-admin/dashboard-admin.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent, ProductListAdminComponent, OrderListAdminComponent, DashboardAdminComponent],
  template: `
    <div class="d-flex bg-light" style="min-height: 100vh;">
      
      <div class="offcanvas-md offcanvas-start bg-dark text-white flex-shrink-0 shadow" 
           tabindex="-1" id="adminSidebar" style="width: 260px; min-height: 100vh;">
        
        <div class="offcanvas-header border-bottom border-secondary bg-dark text-white">
          <h5 class="offcanvas-title fw-bold">Panel Admin</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar"></button>
        </div>

        <div class="offcanvas-body p-3 d-flex flex-column h-100">
          <div class="mb-4 px-2 d-none d-md-block">
             <h4 class="fw-bold mb-0">Abarrotes<span class="text-success">.com</span></h4>
             <small class="text-white-50">Administración</small>
          </div>
          
          <ul class="nav nav-pills flex-column mb-auto gap-2">
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer" 
                 [class.active]="vistaActual === 'dashboard'" 
                 [class.bg-primary]="vistaActual === 'dashboard'"
                 (click)="cambiarVista('dashboard')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-grid-1x2-fill me-2"></i> Resumen
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer" 
                 [class.active]="vistaActual === 'nuevo-producto'" 
                 [class.bg-primary]="vistaActual === 'nuevo-producto'"
                 (click)="cambiarVista('nuevo-producto')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-plus-circle me-2"></i> Nuevo Producto
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer" 
                 [class.active]="vistaActual === 'productos'" 
                 [class.bg-primary]="vistaActual === 'productos'"
                 (click)="cambiarVista('productos')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-box-seam me-2"></i> Inventario
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer" 
                 [class.active]="vistaActual === 'ventas'" 
                 [class.bg-primary]="vistaActual === 'ventas'"
                 (click)="cambiarVista('ventas')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-cash-coin me-2"></i> Ventas
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer" 
                 [class.active]="vistaActual === 'usuarios'" 
                 [class.bg-primary]="vistaActual === 'usuarios'"
                 (click)="cambiarVista('usuarios')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-people me-2"></i> Usuarios
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link text-white cursor-pointer" 
                 [class.active]="vistaActual === 'configuracion'" 
                 [class.bg-primary]="vistaActual === 'configuracion'"
                 (click)="cambiarVista('configuracion')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-tags me-2"></i> Configuración
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex-grow-1 p-3 p-md-5 overflow-auto" style="height: 100vh;">
        
        <button class="btn btn-dark w-100 d-md-none mb-4 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm rounded-pill" 
                type="button" data-bs-toggle="offcanvas" data-bs-target="#adminSidebar">
          <i class="bi bi-list fs-4"></i>
          <span class="fw-bold">MENÚ ADMIN</span>
        </button>

        <div *ngIf="vistaActual === 'dashboard'" class="animate-fade-in">
           <app-dashboard-admin></app-dashboard-admin>
        </div>

        <div *ngIf="vistaActual === 'nuevo-producto'" class="animate-fade-in">
          <h3 class="mb-4 fw-bold">Publicar Producto</h3>
          <div class="card border-0 shadow-sm p-4 bg-white rounded-4" style="max-width: 800px;">
            <form (ngSubmit)="onSubmit()">
                
                <div class="row mb-3">
                  <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <label class="fw-bold small text-muted">Nombre del Producto</label>
                    <input type="text" class="form-control" [(ngModel)]="nuevoProducto.nombre" name="nombre" required placeholder="Ej: Arroz Costeño">
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="fw-bold small text-muted">Marca</label>
                    <div class="input-group">
                      <select class="form-select" [(ngModel)]="nuevoProducto.marca" name="marca" required>
                        <option value="" disabled selected>Selecciona Marca</option>
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
                    <label class="fw-bold small text-muted">Stock</label>
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

                <div class="mb-3">
                   <label class="fw-bold small text-muted">URL Imagen</label>
                   <input type="text" class="form-control" [(ngModel)]="nuevoProducto.imagen" name="imagen" required placeholder="https://...">
                </div>
                <div class="mb-4">
                   <label class="fw-bold small text-muted">Descripción</label>
                   <textarea class="form-control" rows="2" [(ngModel)]="nuevoProducto.descripcion" name="descripcion"></textarea>
                </div>

                <div class="card bg-light border-0 p-3 mb-4 rounded-3 animate-fade-in" *ngIf="nuevoProducto.nombre">
                   <h6 class="fw-bold text-muted small text-uppercase mb-2"><i class="bi bi-eye"></i> Vista Previa</h6>
                   <div class="d-flex align-items-center bg-white p-2 rounded shadow-sm border">
                      <img [src]="nuevoProducto.imagen || 'https://via.placeholder.com/150'" 
                           class="rounded me-3 border object-fit-contain bg-white" 
                           style="width: 60px; height: 60px;"
                           onerror="this.src='https://via.placeholder.com/150'">
                      <div class="flex-grow-1">
                         <div class="fw-bold text-dark">{{ nuevoProducto.nombre }}</div>
                         <div class="small text-muted">
                            <span class="badge bg-secondary me-1" *ngIf="nuevoProducto.marca">{{ nuevoProducto.marca }}</span>
                            {{ nuevoProducto.categoria }}
                         </div>
                      </div>
                      <div class="text-end px-3">
                         <div class="fw-bold text-success fs-5">S/ {{ (nuevoProducto.precioOferta || nuevoProducto.precio) | number:'1.2-2' }}</div>
                         <div *ngIf="nuevoProducto.precioOferta" class="text-decoration-line-through text-muted small">S/ {{ nuevoProducto.precio }}</div>
                      </div>
                   </div>
                </div>

                <div class="d-grid">
                   <button type="submit" class="btn btn-primary btn-lg fw-bold rounded-pill">
                     <i class="bi bi-cloud-upload me-2"></i> Publicar Producto
                   </button>
                </div>
            </form>
          </div>
        </div>

        <div *ngIf="vistaActual === 'productos'" class="animate-fade-in"><app-product-list-admin></app-product-list-admin></div>
        <div *ngIf="vistaActual === 'ventas'" class="animate-fade-in"><app-order-list-admin></app-order-list-admin></div>
        <div *ngIf="vistaActual === 'usuarios'" class="animate-fade-in"><app-user-list></app-user-list></div>

        <div *ngIf="vistaActual === 'configuracion'" class="animate-fade-in">
          <h3 class="mb-4 fw-bold">Configuración</h3>
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
                <div class="card-header bg-white fw-bold py-3">Marcas</div>
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
  styles: [`.cursor-pointer { cursor: pointer; } .nav-link.active { background-color: #0d6efd; color: white !important; }`]
})
export class AdminPageComponent {
  storeService = inject(StoreService);
  vistaActual: 'dashboard' | 'nuevo-producto' | 'productos' | 'usuarios' | 'configuracion' | 'ventas' = 'dashboard';

  nuevoProducto: any = { nombre: '', precio: 0, precioOferta: null, categoria: '', imagen: '', stock: 10, marca: '', descripcion: '' };
  nuevaCat = '';
  nuevaMarca = '';

  cambiarVista(vista: any) { this.vistaActual = vista; }

  async onSubmit() {
    await this.storeService.crearProducto(this.nuevoProducto);
    alert('Producto creado');
    this.nuevoProducto = { nombre: '', precio: 0, categoria: '', imagen: '', stock: 10, marca: '', descripcion: '' };
    this.vistaActual = 'productos';
  }

  agregar(tipo: 'categories' | 'brands', valor: string) {
    if(!valor) return;
    this.storeService.agregarOpcion(tipo, valor);
  }

  borrar(tipo: 'categories' | 'brands', id: string) {
    if(confirm('¿Borrar?')) this.storeService.borrarOpcion(tipo, id);
  }
}