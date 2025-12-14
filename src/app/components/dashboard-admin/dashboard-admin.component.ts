import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <h2 class="fw-bold mb-4">Resumen del Negocio</h2>

      <div class="row g-4 mb-5">
        
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100 bg-primary text-white card-hover">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="bg-white bg-opacity-25 rounded-circle p-2">
                  <i class="bi bi-currency-dollar fs-4"></i>
                </div>
                <span class="badge bg-white text-primary">Total Histórico</span>
              </div>
              <h3 class="fw-bold mb-0">S/ {{ stats.ventasTotales | number:'1.2-2' }}</h3>
              <small class="opacity-75">{{ stats.totalPedidos }} pedidos realizados</small>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100 bg-warning text-dark card-hover">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="bg-white bg-opacity-50 rounded-circle p-2">
                  <i class="bi bi-clock-history fs-4"></i>
                </div>
                <span class="badge bg-dark text-warning">Atención Requerida</span>
              </div>
              <h3 class="fw-bold mb-0">{{ stats.pedidosPendientes }}</h3>
              <small>Pedidos por despachar</small>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100 bg-success text-white card-hover">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="bg-white bg-opacity-25 rounded-circle p-2">
                  <i class="bi bi-people fs-4"></i>
                </div>
                <span class="badge bg-white text-success">Clientes</span>
              </div>
              <h3 class="fw-bold mb-0">{{ stats.totalUsuarios }}</h3>
              <small class="opacity-75">Usuarios registrados</small>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-xl-3">
          <div class="card border-0 shadow-sm h-100 bg-danger text-white card-hover">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="bg-white bg-opacity-25 rounded-circle p-2">
                  <i class="bi bi-exclamation-triangle fs-4"></i>
                </div>
                <span class="badge bg-white text-danger">Alerta Stock</span>
              </div>
              <h3 class="fw-bold mb-0">{{ stats.stockBajo }}</h3>
              <small class="opacity-75">Productos con < 5 unidades</small>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white fw-bold py-3">
              <i class="bi bi-box-seam text-danger me-2"></i>Reponer Inventario
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex align-items-center justify-content-between" 
                     *ngFor="let p of productosBajosStock">
                  <div class="d-flex align-items-center">
                    <img [src]="p.imagen" class="rounded me-3 border bg-light" style="width: 40px; height: 40px; object-fit: contain;">
                    <div>
                      <div class="fw-bold small text-truncate" style="max-width: 150px;">{{ p.nombre }}</div>
                      <small class="text-muted">{{ p.marca }}</small>
                    </div>
                  </div>
                  <span class="badge bg-danger rounded-pill">{{ p.stock }} un.</span>
                </div>
                
                <div *ngIf="productosBajosStock.length === 0" class="p-5 text-center text-muted">
                  <i class="bi bi-check-circle fs-1 text-success mb-2 d-block"></i>
                  <span>Todo el inventario está saludable.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100 bg-dark text-white text-center p-4" 
               style="background: linear-gradient(135deg, #212529, #495057);">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <div class="mb-4 p-3 bg-white bg-opacity-10 rounded-circle">
                <i class="bi bi-rocket-takeoff display-4 text-success"></i>
              </div>
              <h3>Sistema Operativo</h3>
              <p class="text-white-50 mb-4">Tu tienda está funcionando correctamente en la nube.</p>
              <div class="d-flex gap-2">
                 <button class="btn btn-outline-light btn-sm px-4">Ver Reportes</button>
                 <button class="btn btn-success btn-sm fw-bold px-4">Configuración</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .card-hover { transition: transform 0.2s; }
    .card-hover:hover { transform: translateY(-5px); }
  `]
})
export class DashboardAdminComponent implements OnInit {
  storeService = inject(StoreService);
  authService = inject(AuthService);

  stats = {
    ventasTotales: 0,
    pedidosPendientes: 0,
    totalPedidos: 0,
    totalUsuarios: 0,
    stockBajo: 0
  };

  productosBajosStock: any[] = [];

  constructor() {
    // Usamos effect para que el contador de stock bajo se actualice solo
    effect(() => {
      const productos = this.storeService.productos();
      this.productosBajosStock = productos.filter((p: any) => (p.stock || 0) < 5);
      this.stats.stockBajo = this.productosBajosStock.length;
    });
  }

  ngOnInit() {
    this.storeService.obtenerOrdenes().subscribe(ordenes => {
      this.stats.totalPedidos = ordenes.length;
      this.stats.pedidosPendientes = ordenes.filter(o => o.estado === 'pendiente').length;
      this.stats.ventasTotales = ordenes
        .filter(o => o.estado === 'pagado' || o.estado === 'enviado')
        .reduce((acc, curr) => acc + (curr.total || 0), 0);
    });

    this.authService.obtenerTodosLosUsuarios().subscribe(users => {
      this.stats.totalUsuarios = users.length;
    });
  }
}