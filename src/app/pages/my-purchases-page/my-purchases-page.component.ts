import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-purchases-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5 animate-fade-in">
      
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="fw-bold mb-0 text-dark">Mis Pedidos</h2>
        <span class="badge bg-light text-dark border">{{ pedidos().length }} compras</span>
      </div>

      <div *ngIf="cargando()" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="text-muted mt-2 small">Buscando tu historial...</p>
      </div>

      <div *ngIf="!cargando() && pedidos().length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
        <div class="mb-3">
           <div class="bg-light rounded-circle d-inline-flex p-4">
             <i class="bi bi-bag-x display-4 text-muted opacity-50"></i>
           </div>
        </div>
        <h4 class="fw-bold text-dark">Aún no has realizado compras</h4>
        <p class="text-muted mb-4">¡Llena tu despensa con los mejores productos!</p>
        <button class="btn btn-success rounded-pill px-5 fw-bold shadow-sm" routerLink="/">
          Ir a la Tienda
        </button>
      </div>

      <div class="row g-4" *ngIf="!cargando() && pedidos().length > 0">
        <div class="col-md-10 mx-auto">
          
          <div class="card border-0 shadow-sm mb-4 overflow-hidden rounded-4" 
               *ngFor="let orden of pedidos()"
               [class.border-start]="true"
               [class.border-4]="true"
               [class.border-warning]="orden.estado === 'pendiente'"
               [class.border-success]="orden.estado === 'enviado' || orden.estado === 'pagado'">
            
            <div class="card-header bg-light bg-opacity-50 py-3 px-4 border-bottom">
              <div class="row align-items-center g-3">
                <div class="col-6 col-md-3">
                  <small class="text-uppercase text-muted fw-bold d-block" style="font-size: 0.65rem;">Fecha de pedido</small>
                  <span class="fw-bold text-dark">{{ orden.fecha.seconds * 1000 | date:'dd MMM yyyy' }}</span>
                </div>
                <div class="col-6 col-md-3">
                  <small class="text-uppercase text-muted fw-bold d-block" style="font-size: 0.65rem;">Total</small>
                  <span class="text-success fw-bold">S/ {{ orden.total | number:'1.2-2' }}</span>
                </div>
                <div class="col-6 col-md-3">
                  <small class="text-uppercase text-muted fw-bold d-block" style="font-size: 0.65rem;">Pago</small>
                  <span *ngIf="orden.metodoPago === 'tarjeta'" class="badge bg-white text-dark border"><i class="bi bi-credit-card me-1"></i> Tarjeta</span>
                  <span *ngIf="orden.metodoPago === 'yape'" class="badge bg-yape text-white"><i class="bi bi-qr-code me-1"></i> Yape</span>
                </div>
                <div class="col-6 col-md-3 text-md-end">
                   <span class="badge rounded-pill px-3 py-2 text-uppercase"
                      [class.bg-warning]="orden.estado === 'pendiente'"
                      [class.text-dark]="orden.estado === 'pendiente'"
                      [class.bg-success]="orden.estado === 'pagado' || orden.estado === 'enviado'">
                      {{ orden.estado }}
                   </span>
                </div>
              </div>
            </div>

            <div class="card-body p-4 bg-white">
              <div class="row g-4">
                <div class="col-md-8">
                   <div class="d-flex align-items-center mb-3" *ngFor="let p of orden.productos">
                      <div class="position-relative me-3">
                        <img [src]="p.imagen" class="rounded border p-1 bg-white" style="width: 60px; height: 60px; object-fit: contain;">
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style="font-size: 0.6rem;">
                           {{ p.cantidadCarrito }}
                        </span>
                      </div>
                      <div>
                        <div class="fw-bold text-dark small">{{ p.nombre }}</div>
                        <small class="text-muted d-block">{{ p.marca }}</small>
                      </div>
                      <div class="ms-auto fw-bold text-dark small">
                        S/ {{ (p.precioOferta || p.precio) * p.cantidadCarrito | number:'1.2-2' }}
                      </div>
                   </div>
                </div>

                <div class="col-md-4 border-start-md ps-md-4 d-flex flex-column justify-content-center">
                   <div *ngIf="orden.estado === 'pendiente'" class="alert alert-warning border-0 bg-warning bg-opacity-10 small mb-0">
                      <i class="bi bi-hourglass-split me-1"></i> Estamos validando tu pago. Te notificaremos por WhatsApp.
                   </div>
                   <div *ngIf="orden.estado === 'enviado'" class="alert alert-success border-0 bg-success bg-opacity-10 small mb-0">
                      <i class="bi bi-truck me-1"></i> ¡Tu pedido está en camino a {{ orden.direccion }}!
                   </div>
                   
                   <button class="btn btn-outline-dark btn-sm w-100 mt-3 rounded-pill">
                     <i class="bi bi-headset me-1"></i> Ayuda con este pedido
                   </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-yape { background-color: #742284; }
    .border-start-md { border-left: 1px solid #dee2e6; }
    @media (max-width: 768px) { .border-start-md { border-left: none; border-top: 1px solid #dee2e6; padding-top: 1rem; margin-top: 1rem; } }
  `]
})
export class MyPurchasesPageComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  
  // Usamos signals para manejar el estado reactivo y EVITAR EL BUG
  pedidos = signal<any[]>([]);
  cargando = signal<boolean>(true);

  constructor() {
    // EFFECT: Esto arregla el bug. Se ejecuta automáticamente cuando el usuario carga.
    effect(() => {
      const usuario = this.authService.currentUserProfile(); // Signal del usuario
      
      if (usuario) {
        this.cargando.set(true);
        this.storeService.obtenerMisPedidos(usuario.uid).subscribe({
          next: (data) => {
            // Ordenamos: más reciente primero
            const ordenados = data.sort((a, b) => b.fecha.seconds - a.fecha.seconds);
            this.pedidos.set(ordenados);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false)
        });
      } else {
        // Si no hay usuario (o aún no carga), mantenemos o limpiamos estado
        // Pero no "trabamos" la app
      }
    });
  }
}