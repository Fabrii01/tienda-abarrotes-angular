import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-purchases-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <h2 class="fw-bold mb-4"><i class="bi bi-bag-check me-2"></i>Mis Compras</h2>

      <div *ngIf="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div *ngIf="!cargando && pedidos.length === 0" class="text-center py-5 bg-light rounded">
        <i class="bi bi-emoji-frown display-1 text-muted"></i>
        <h4 class="mt-3">Aún no has realizado compras</h4>
        <button class="btn btn-primary mt-2" routerLink="/">Ir a la tienda</button>
      </div>

      <div class="row" *ngIf="!cargando && pedidos.length > 0">
        <div class="col-md-10 mx-auto">
          
          <div class="card border-0 shadow-sm mb-4" *ngFor="let orden of pedidos.sort(ordenarPorFecha)">
            
            <div class="card-header bg-light d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Fecha de pedido</small>
                <span class="fw-bold">{{ orden.fecha.seconds * 1000 | date:'dd/MM/yyyy' }}</span>
              </div>
              
              <div>
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Total</small>
                <span class="text-success fw-bold">S/ {{ orden.total | number:'1.2-2' }}</span>
              </div>

              <div>
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Pago</small>
                <span class="badge bg-white text-dark border border-secondary" *ngIf="orden.metodoPago === 'tarjeta'">
                  <i class="bi bi-credit-card me-1"></i> Tarjeta
                </span>
                <span class="badge bg-yape text-white" *ngIf="orden.metodoPago === 'yape'">
                  YAPE (Op: {{ orden.datosPago?.codigoOperacion }})
                </span>
              </div>

              <div class="text-end">
                <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Estado</small>
                <span class="badge rounded-pill"
                      [class.bg-warning]="orden.estado === 'pendiente'"
                      [class.bg-success]="orden.estado === 'pagado'"
                      [class.bg-info]="orden.estado === 'enviado'">
                  {{ orden.estado | uppercase }}
                </span>
              </div>
            </div>

            <div class="card-body">
              <div class="d-flex align-items-center mb-3" *ngFor="let p of orden.productos">
                <img [src]="p.imagen" class="rounded border me-3" style="width: 60px; height: 60px; object-fit: contain;">
                <div>
                  <div class="fw-bold">{{ p.nombre }}</div>
                  <small class="text-muted">Cantidad: {{ p.cantidadCarrito }} | Precio: S/ {{ p.precioOferta || p.precio }}</small>
                </div>
              </div>
            </div>

            <div class="card-footer bg-white border-top-0 text-end">
              <small class="text-muted fst-italic" *ngIf="orden.estado === 'pendiente'">
                <i class="bi bi-clock"></i> Tu pago está siendo validado.
              </small>
              <small class="text-success fw-bold" *ngIf="orden.estado === 'enviado'">
                <i class="bi bi-truck"></i> ¡Tu pedido está en camino!
              </small>
            </div>

          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-yape { background-color: #742284; }
  `]
})
export class MyPurchasesPageComponent implements OnInit {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  
  pedidos: any[] = [];
  cargando = true;

  ngOnInit() {
    const usuario = this.authService.currentUserProfile();
    
    if (usuario) {
      // Pedimos al servicio SOLO los pedidos de este usuario
      this.storeService.obtenerMisPedidos(usuario.uid).subscribe(data => {
        this.pedidos = data;
        this.cargando = false;
      });
    } else {
      this.cargando = false;
    }
  }

  ordenarPorFecha(a: any, b: any) {
    return b.fecha.seconds - a.fecha.seconds; // Más reciente arriba
  }
}