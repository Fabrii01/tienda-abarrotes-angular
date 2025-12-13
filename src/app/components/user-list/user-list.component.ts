import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow-sm mt-4">
      
      <div class="card-header bg-white py-3">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 class="mb-0 fw-bold"><i class="bi bi-people me-2"></i>Gestión de Usuarios</h5>
          <div class="d-flex gap-2">
            <button class="btn btn-sm fw-bold" 
                    [class.btn-outline-secondary]="!mostrarSoloInactivos"
                    [class.btn-danger]="mostrarSoloInactivos"
                    (click)="toggleFiltro()">
              <i class="bi" [class.bi-toggle-off]="!mostrarSoloInactivos" [class.bi-toggle-on]="mostrarSoloInactivos"></i>
              {{ mostrarSoloInactivos ? 'Papelera' : 'Activos' }}
            </button>
            <button class="btn btn-sm btn-success fw-bold" data-bs-toggle="modal" data-bs-target="#addUserModal">
              <i class="bi bi-person-plus-fill me-2"></i> Nuevo
            </button>
          </div>
        </div>
      </div>
      
      <div class="table-responsive" style="min-height: 400px;"> 
        <table class="table table-hover align-middle mb-0 text-nowrap">
          <thead class="table-light">
            <tr>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of usuariosFiltrados()">
              <td>
                <div class="d-flex align-items-center">
                  <div class="bg-light rounded-circle p-2 me-2"><i class="bi bi-person text-secondary"></i></div>
                  <div>
                    <div class="fw-bold">{{ user.nombre }}</div>
                    <div class="text-muted small text-truncate" style="max-width: 120px;">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge rounded-pill" 
                      [class.bg-success]="user.estado === 'activo' || !user.estado" 
                      [class.bg-danger]="user.estado === 'inactivo'">
                  {{ (user.estado || 'activo').substring(0,3) | uppercase }}
                </span>
              </td>
              <td><span class="badge border text-dark bg-light">{{ user.role | uppercase }}</span></td>
              <td class="small">
                <div><i class="bi bi-phone me-1"></i> {{ user.celular || '-' }}</div>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#userModal" (click)="seleccionarUsuario(user)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-display="static"> 
                      <i class="bi bi-gear"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                      <li><h6 class="dropdown-header">Estado</h6></li>
                      <li><button class="dropdown-item text-success" (click)="cambiarEstado(user, 'activo')">Activar</button></li>
                      <li><button class="dropdown-item text-warning" (click)="cambiarEstado(user, 'inactivo')">Desactivar</button></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><h6 class="dropdown-header">Rol</h6></li>
                      <li><button class="dropdown-item" (click)="cambiarRol(user, 'admin')">Admin</button></li>
                      <li><button class="dropdown-item" (click)="cambiarRol(user, 'cliente')">Cliente</button></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><button class="dropdown-item text-danger fw-bold" (click)="borrarUsuario(user)">Eliminar</button></li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="addUserModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Nuevo Usuario</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="guardarNuevoUsuario()">
              <div class="row mb-3">
                <div class="col-6"><label class="small fw-bold">Nombre</label><input type="text" class="form-control" [(ngModel)]="nuevoUsuario.nombre" name="nombre" required></div>
                <div class="col-6"><label class="small fw-bold">Apellidos</label><input type="text" class="form-control" [(ngModel)]="nuevoUsuario.apellidos" name="apellidos" required></div>
              </div>
              <div class="mb-3"><label class="small fw-bold">Correo</label><input type="email" class="form-control" [(ngModel)]="nuevoUsuario.email" name="email" required></div>
              <div class="row mb-3">
                <div class="col-6"><label class="small fw-bold">DNI</label><input type="text" class="form-control" [(ngModel)]="nuevoUsuario.dni" name="dni"></div>
                <div class="col-6"><label class="small fw-bold">Celular</label><input type="text" class="form-control" [(ngModel)]="nuevoUsuario.celular" name="celular"></div>
              </div>
              <button type="submit" class="btn btn-success w-100 fw-bold" data-bs-dismiss="modal">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-fullscreen-sm-down"> 
        <div class="modal-content" *ngIf="usuarioSeleccionado">
          <div class="modal-header">
            <div>
              <h5 class="modal-title fw-bold text-truncate" style="max-width: 250px;">{{ usuarioSeleccionado.nombre }}</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body bg-light">
             <div *ngFor="let p of favoritosDetallados" class="list-group-item d-flex align-items-center gap-3 py-3">
                 <img [src]="p.imagen" class="rounded border" style="width: 50px; height: 50px; object-fit: cover;">
                 <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold text-truncate" style="max-width: 150px;">{{ p.nombre }}</h6>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  authService = inject(AuthService);
  storeService = inject(StoreService);

  usuarios: any[] = [];
  usuarioSeleccionado: any = null;
  mostrarSoloInactivos = false;
  nuevoUsuario = { nombre: '', apellidos: '', email: '', dni: '', celular: '' };
  favoritosDetallados: Producto[] = []; 

  ngOnInit() {
    this.authService.obtenerTodosLosUsuarios().subscribe((data: any[]) => {
      this.usuarios = data;
    });
  }

  usuariosFiltrados() {
    if (this.mostrarSoloInactivos) return this.usuarios.filter(u => u.estado === 'inactivo');
    return this.usuarios.filter(u => u.estado !== 'inactivo');
  }

  toggleFiltro() { this.mostrarSoloInactivos = !this.mostrarSoloInactivos; }

  cambiarRol(user: any, rol: 'admin'|'cliente') {
    if(confirm(`¿Hacer ${rol} a ${user.nombre}?`)) this.authService.actualizarRolUsuario(user.uid, rol);
  }
  cambiarEstado(user: any, estado: 'activo'|'inactivo') {
    this.authService.cambiarEstadoUsuario(user.uid, estado);
  }
  borrarUsuario(user: any) {
    if(confirm('¿Eliminar usuario permanentemente?')) this.authService.eliminarUsuario(user.uid);
  }
  async guardarNuevoUsuario() {
    await this.authService.crearUsuarioDesdeAdmin(this.nuevoUsuario);
    this.nuevoUsuario = { nombre: '', apellidos: '', email: '', dni: '', celular: '' };
  }

  seleccionarUsuario(user: any) {
    this.usuarioSeleccionado = user;
    this.favoritosDetallados = []; 
    this.storeService.obtenerFavoritosDeUsuario(user.uid).subscribe((favs: any[]) => {
      const listaIds = favs.map((f: any) => f.id);
      const todosLosProductos = this.storeService.productos(); 
      this.favoritosDetallados = todosLosProductos.filter(p => listaIds.includes(p.id));
    });
  }
}