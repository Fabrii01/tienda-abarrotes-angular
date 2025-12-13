import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ProductListAdminComponent } from '../../components/product-list-admin/product-list-admin.component';
import { OrderListAdminComponent } from '../../components/order-list-admin/order-list-admin.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, UserListComponent, ProductListAdminComponent, OrderListAdminComponent],
  template: `
    <div class="d-flex" style="min-height: 90vh;">
      
      <button class="btn btn-primary d-md-none position-fixed top-0 start-0 m-3 z-3 shadow" 
              type="button" data-bs-toggle="offcanvas" data-bs-target="#adminSidebar">
        <i class="bi bi-list fs-4"></i>
      </button>

      <div class="offcanvas-md offcanvas-start bg-dark text-white flex-shrink-0" 
           tabindex="-1" id="adminSidebar" style="width: 250px;">
        
        <div class="offcanvas-header border-bottom border-secondary">
          <h5 class="offcanvas-title fw-bold">Panel Admin</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar"></button>
        </div>

        <div class="offcanvas-body p-3 d-flex flex-column h-100">
          <span class="fs-4 fw-bold mb-3 d-none d-md-block">Panel Admin</span>
          <hr class="d-none d-md-block border-secondary">
          
          <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item mb-2">
              <a class="nav-link text-white cursor-pointer" [class.active]="vistaActual === 'nuevo-producto'" 
                 (click)="cambiarVista('nuevo-producto')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-plus-circle me-2"></i> Nuevo Producto
              </a>
            </li>
            
            <li class="nav-item mb-2">
              <a class="nav-link text-white cursor-pointer" [class.active]="vistaActual === 'productos'" 
                 (click)="cambiarVista('productos')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-box-seam me-2"></i> Inventario
              </a>
            </li>
            
            <li class="nav-item mb-2">
              <a class="nav-link text-white cursor-pointer" [class.active]="vistaActual === 'ventas'" 
                 (click)="cambiarVista('ventas')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-cash-coin me-2"></i> Ventas / Pedidos
              </a>
            </li>

            <li class="nav-item mb-2">
              <a class="nav-link text-white cursor-pointer" [class.active]="vistaActual === 'usuarios'" 
                 (click)="cambiarVista('usuarios')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-people me-2"></i> Usuarios
              </a>
            </li>
            
            <li class="nav-item mb-2">
              <a class="nav-link text-white cursor-pointer" [class.active]="vistaActual === 'configuracion'" 
                 (click)="cambiarVista('configuracion')" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar">
                <i class="bi bi-tags me-2"></i> Marcas y Categ.
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex-grow-1 p-3 p-md-4 bg-light overflow-auto" style="height: 90vh;">
        <div class="d-md-none mb-5"></div> 

        <div *ngIf="vistaActual === 'nuevo-producto'">
          <h3 class="mb-4 fw-bold">Agregar Producto</h3>
          <div class="card border-0 shadow-sm p-3 p-md-4" style="max-width: 800px;">
            <form (ngSubmit)="onSubmit()">
                
                <div class="row mb-3">
                  <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <label class="fw-bold small">Nombre</label>
                    <input type="text" class="form-control" [(ngModel)]="nuevoProducto.nombre" name="nombre" required>
                  </div>
                  
                  <div class="col-12 col-md-6">
                    <label class="fw-bold small">Marca</label>
                    <div class="input-group">
                      <select class="form-select" [(ngModel)]="nuevoProducto.marca" name="marca" required>
                        <option value="" disabled selected>Selecciona Marca</option>
                        <option *ngFor="let m of storeService.marcas()" [value]="m.nombre">{{ m.nombre }}</option>
                      </select>
                      <button class="btn btn-outline-secondary" type="button" (click)="vistaActual = 'configuracion'" title="Crear nueva marca">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <label class="fw-bold small">Categoría</label>
                    <div class="input-group">
                      <select class="form-select" [(ngModel)]="nuevoProducto.categoria" name="categoria" required>
                        <option value="" disabled selected>Selecciona Categoría</option>
                        <option *ngFor="let c of storeService.categorias()" [value]="c.nombre">{{ c.nombre }}</option>
                      </select>
                      <button class="btn btn-outline-secondary" type="button" (click)="vistaActual = 'configuracion'" title="Crear nueva categoría">
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="col-12 col-md-6">
                    <label class="fw-bold small">Stock</label>
                    <input type="number" class="form-control" [(ngModel)]="nuevoProducto.stock" name="stock" required min="0">
                  </div>
                </div>

                <div class="row mb-3 bg-light p-2 rounded mx-0 border">
                   <div class="col-6">
                      <label class="fw-bold small">Precio Real</label>
                      <input type="number" class="form-control" [(ngModel)]="nuevoProducto.precio" name="precio" required step="0.10">
                   </div>
                   <div class="col-6">
                      <label class="fw-bold small text-danger">Precio Oferta</label>
                      <input type="number" class="form-control border-danger" [(ngModel)]="nuevoProducto.precioOferta" name="precioOferta">
                   </div>
                </div>

                <div class="mb-3">
                   <label class="fw-bold small">Imagen URL</label>
                   <input type="text" class="form-control" [(ngModel)]="nuevoProducto.imagen" name="imagen" required>
                </div>
                <div class="mb-3">
                   <label class="fw-bold small">Descripción</label>
                   <textarea class="form-control" rows="2" [(ngModel)]="nuevoProducto.descripcion" name="descripcion"></textarea>
                </div>

                <div class="alert alert-light border d-flex align-items-center mb-4" *ngIf="nuevoProducto.nombre">
                  <img [src]="nuevoProducto.imagen || 'https://via.placeholder.com/50'" class="rounded me-3 border" style="width: 50px; height: 50px; object-fit: contain;">
                  <div>
                    <strong class="d-block">{{ nuevoProducto.nombre }}</strong>
                    <span class="badge bg-secondary me-2" *ngIf="nuevoProducto.marca">{{ nuevoProducto.marca }}</span>
                    <span class="text-success fw-bold">S/ {{ nuevoProducto.precio }}</span>
                  </div>
                </div>

                <button type="submit" class="btn btn-success fw-bold w-100 py-2">Publicar Producto</button>
            </form>
          </div>
        </div>

        <div *ngIf="vistaActual === 'productos'">
          <h3 class="mb-4 fw-bold">Inventario</h3>
          <app-product-list-admin></app-product-list-admin>
        </div>

        <div *ngIf="vistaActual === 'ventas'">
          <h3 class="mb-4 fw-bold">Registro de Ventas</h3>
          <app-order-list-admin></app-order-list-admin>
        </div>

        <div *ngIf="vistaActual === 'usuarios'">
          <h3 class="mb-4 fw-bold">Usuarios</h3>
          <app-user-list></app-user-list>
        </div>

        <div *ngIf="vistaActual === 'configuracion'">
          <h3 class="mb-4 fw-bold">Configuración de Tienda</h3>
          
          <div class="row">
            <div class="col-12 col-lg-6 mb-4">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white fw-bold">Gestión de Categorías</div>
                <div class="card-body">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Nueva Categoría" [(ngModel)]="nuevaCat">
                    <button class="btn btn-primary" (click)="agregar('categories', nuevaCat); nuevaCat = ''">Agregar</button>
                  </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let c of storeService.categorias()">
                      {{ c.nombre }}
                      <button class="btn btn-sm btn-outline-danger border-0" (click)="borrar('categories', c.id)"><i class="bi bi-trash"></i></button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-6 mb-4">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white fw-bold">Gestión de Marcas</div>
                <div class="card-body">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Nueva Marca" [(ngModel)]="nuevaMarca">
                    <button class="btn btn-primary" (click)="agregar('brands', nuevaMarca); nuevaMarca = ''">Agregar</button>
                  </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let m of storeService.marcas()">
                      {{ m.nombre }}
                      <button class="btn btn-sm btn-outline-danger border-0" (click)="borrar('brands', m.id)"><i class="bi bi-trash"></i></button>
                    </li>
                  </ul>
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
  
  vistaActual: 'nuevo-producto' | 'productos' | 'usuarios' | 'configuracion' | 'ventas' = 'nuevo-producto';

  nuevoProducto: any = { nombre: '', precio: 0, precioOferta: null, categoria: '', imagen: '', stock: 10, marca: '', descripcion: '' };
  
  nuevaCat = '';
  nuevaMarca = '';

  cambiarVista(vista: any) {
    this.vistaActual = vista;
  }

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
    if(confirm('¿Borrar esta opción?')) {
      this.storeService.borrarOpcion(tipo, id);
    }
  }
}