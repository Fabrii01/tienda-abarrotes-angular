import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-receipt me-2"></i>Control de Ventas</h5>
      </div>

      <div class="table-responsive" style="min-height: 500px; padding-bottom: 100px;">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Fecha</th>
              <th>Cliente / Entrega</th> <th>Método Pago</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let orden of ordenes.sort(ordenarPorFecha)">
              
              <td class="small text-muted">
                {{ orden.fecha.seconds * 1000 | date:'dd/MM/yy HH:mm' }}
              </td>

              <td>
                <div class="fw-bold">{{ orden.usuarioNombre }}</div>
                <div class="small text-muted mb-1">{{ orden.email }}</div>
                
                <span class="badge bg-light text-dark border" *ngIf="orden.tipoEntrega">
                  <i class="bi" [class.bi-truck]="orden.tipoEntrega === 'delivery'" [class.bi-shop]="orden.tipoEntrega === 'recojo'"></i>
                  {{ orden.tipoEntrega | uppercase }}
                </span>
              </td>

              <td>
                <div *ngIf="orden.metodoPago === 'yape'">
                  <span class="badge bg-yape text-white">YAPE</span>
                  <div class="small fw-bold mt-1 text-dark">Op: {{ orden.datosPago?.codigoOperacion }}</div>
                </div>
                <div *ngIf="orden.metodoPago === 'tarjeta'">
                  <span class="badge bg-primary">TARJETA</span>
                  <div class="small text-muted">{{ orden.datosPago?.tarjeta }}</div>
                </div>
              </td>

              <td class="fw-bold text-success">
                S/ {{ orden.total | number:'1.2-2' }}
              </td>

              <td>
                <span class="badge rounded-pill"
                      [class.bg-warning]="orden.estado === 'pendiente'"
                      [class.bg-success]="orden.estado === 'pagado'"
                      [class.bg-info]="orden.estado === 'enviado'">
                  {{ orden.estado | uppercase }}
                </span>
              </td>

              <td>
                <div class="d-flex gap-2">
                  
                  <button class="btn btn-sm btn-success" 
                          (click)="enviarBoletaWhatsapp(orden)" 
                          title="Enviar Boleta por WhatsApp">
                    <i class="bi bi-whatsapp"></i>
                  </button>

                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-dark dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            data-bs-display="static">
                      <i class="bi bi-gear"></i>
                    </button>
                    
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                      <li><h6 class="dropdown-header">Cambiar Estado</h6></li>
                      
                      <li>
                        <button class="dropdown-item text-success fw-bold" (click)="cambiarEstado(orden, 'pagado')">
                          <i class="bi bi-check2-all me-2"></i>Confirmar Pago
                        </button>
                      </li>
                      
                      <li>
                        <button class="dropdown-item text-info fw-bold" (click)="cambiarEstado(orden, 'enviado')">
                          <i class="bi bi-box-seam me-2"></i>Marcar Enviado
                        </button>
                      </li>

                      <li><hr class="dropdown-divider"></li>
                      <li>
                          <button class="dropdown-item small" data-bs-toggle="modal" data-bs-target="#detalleOrdenModal" (click)="verDetalle(orden)">
                              Ver Productos
                          </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="detalleOrdenModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" *ngIf="ordenSeleccionada">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Pedido de {{ ordenSeleccionada.usuarioNombre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center" 
                  *ngFor="let p of ordenSeleccionada.productos">
                <div class="d-flex align-items-center">
                  <span class="badge bg-secondary me-2">{{ p.cantidadCarrito }}</span>
                  {{ p.nombre }}
                </div>
                <span class="fw-bold">S/ {{ p.precioOferta || p.precio }}</span>
              </li>
            </ul>
            <div class="text-end mt-3 pt-3 border-top">
              <h4 class="fw-bold">Total: S/ {{ ordenSeleccionada.total | number:'1.2-2' }}</h4>
            </div>
            
            <div class="mt-3 bg-light p-3 rounded" *ngIf="ordenSeleccionada.tipoEntrega">
                <p class="mb-1"><strong>Entrega:</strong> {{ ordenSeleccionada.tipoEntrega | uppercase }}</p>
                <p class="mb-1"><strong>Fecha:</strong> {{ ordenSeleccionada.horarioEntrega | date:'short' }}</p>
                <p class="mb-0" *ngIf="ordenSeleccionada.direccion"><strong>Dirección:</strong> {{ ordenSeleccionada.direccion }}</p>
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
export class OrderListAdminComponent implements OnInit {
  storeService = inject(StoreService);
  ordenes: any[] = [];
  ordenSeleccionada: any = null;

  ngOnInit() {
    this.storeService.obtenerOrdenes().subscribe(data => {
      this.ordenes = data;
    });
  }

  ordenarPorFecha(a: any, b: any) {
    return b.fecha.seconds - a.fecha.seconds;
  }

  cambiarEstado(orden: any, estado: 'pagado' | 'enviado') {
    if(confirm(`¿Marcar pedido de ${orden.usuarioNombre} como ${estado.toUpperCase()}?`)) {
      this.storeService.actualizarEstadoOrden(orden.id, estado);
    }
  }

  verDetalle(orden: any) {
    this.ordenSeleccionada = orden;
  }

  // --- NUEVA FUNCIÓN: ENVIAR BOLETA ---
  enviarBoletaWhatsapp(orden: any) {
    if (!orden.celular) {
      alert('Este pedido no tiene número de celular registrado.');
      return;
    }

    // 1. Construir el mensaje
    let mensaje = `Hola *${orden.usuarioNombre}*, gracias por tu compra en Abarrotes.com! 🛒\n\n`;
    mensaje += `📅 *Fecha:* ${new Date(orden.fecha.seconds * 1000).toLocaleDateString()}\n`;
    
    // Agregamos info de entrega si existe
    if (orden.tipoEntrega) {
       mensaje += `🚚 *Entrega:* ${orden.tipoEntrega.toUpperCase()} - ${orden.horarioEntrega}\n`;
       if (orden.direccion) mensaje += `📍 *Dirección:* ${orden.direccion}\n`;
    }
    
    mensaje += `--------------------------------\n`;
    
    // Listar productos
    orden.productos.forEach((p: any) => {
      mensaje += `▪️ ${p.nombre} (x${p.cantidadCarrito}) - S/ ${(p.precioOferta || p.precio) * p.cantidadCarrito}\n`;
    });
    
    mensaje += `--------------------------------\n`;
    mensaje += `💰 *TOTAL PAGADO:* S/ ${orden.total}\n`;
    mensaje += `✅ *Estado:* ${orden.estado.toUpperCase()}\n\n`;
    mensaje += `Gracias por tu preferencia!`;

    // 2. Crear Link
    const url = `https://wa.me/51${orden.celular}?text=${encodeURIComponent(mensaje)}`;

    // 3. Abrir
    window.open(url, '_blank');
  }
}