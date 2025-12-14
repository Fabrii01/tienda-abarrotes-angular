import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5 animate-fade-in">
      
      <div class="mb-4">
        <h2 class="fw-bold text-dark">Finalizar Compra</h2>
        <p class="text-muted">Estás a un paso de completar tu pedido.</p>
      </div>
      
      <div class="row g-5">
        
        <div class="col-lg-8">
          
          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div class="card-header bg-white border-bottom p-4">
              <h5 class="fw-bold mb-0"><span class="badge bg-dark rounded-circle me-2">1</span> Datos de Contacto</h5>
            </div>
            <div class="card-body p-4">
              
              <div *ngIf="usuarioTieneCelular" class="alert alert-success bg-success bg-opacity-10 border-0 d-flex align-items-center rounded-3">
                 <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                 <div>
                   <strong class="text-success-emphasis">Identidad Verificada</strong>
                   <div class="small text-muted">Te enviaremos la confirmación y boleta a tu WhatsApp registrado.</div>
                 </div>
              </div>

              <div *ngIf="!usuarioTieneCelular">
                <label class="form-label fw-bold text-muted small">Número de WhatsApp</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text bg-white border-end-0 text-success"><i class="bi bi-whatsapp"></i></span>
                  <input type="tel" class="form-control border-start-0 ps-0" 
                         placeholder="Ej: 999 888 777" 
                         [(ngModel)]="celularCliente" 
                         maxlength="9" required>
                </div>
                <div class="form-text small mt-2">Es vital para coordinar la entrega de tu pedido.</div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div class="card-header bg-white border-bottom p-4">
              <h5 class="fw-bold mb-0"><span class="badge bg-dark rounded-circle me-2">2</span> Modalidad de Entrega</h5>
            </div>
            <div class="card-body p-4">
              
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <div class="option-card p-3 rounded-3 border cursor-pointer h-100 text-center transition-all"
                       [class.selected]="tipoEntrega === 'delivery'"
                       (click)="seleccionarTipo('delivery')">
                    <i class="bi bi-truck display-6 d-block mb-2" [class.text-primary]="tipoEntrega === 'delivery'"></i>
                    <span class="fw-bold d-block">Delivery a Casa</span>
                    <small class="text-muted">Recibe en tu puerta</small>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="option-card p-3 rounded-3 border cursor-pointer h-100 text-center transition-all"
                       [class.selected]="tipoEntrega === 'recojo'"
                       (click)="seleccionarTipo('recojo')">
                    <i class="bi bi-shop display-6 d-block mb-2" [class.text-primary]="tipoEntrega === 'recojo'"></i>
                    <span class="fw-bold d-block">Recojo en Tienda</span>
                    <small class="text-muted">Sin costo de envío</small>
                  </div>
                </div>
              </div>

              <div class="mb-4 animate-fade-in" *ngIf="tipoEntrega === 'delivery'">
                 <label class="form-label fw-bold text-muted small">Dirección de Entrega</label>
                 <div class="input-group">
                    <span class="input-group-text bg-white"><i class="bi bi-geo-alt"></i></span>
                    <input type="text" class="form-control" placeholder="Av. Principal 123, Dpto 401, Referencia..." [(ngModel)]="direccionEntrega">
                 </div>
              </div>

              <div *ngIf="tipoEntrega" class="animate-fade-in">
                <label class="form-label fw-bold text-muted small mb-3">Elige un horario:</label>
                <div class="d-grid gap-2">
                  <div *ngFor="let opcion of opcionesHorarias" 
                       class="p-3 border rounded-3 cursor-pointer d-flex justify-content-between align-items-center transition-all hover-bg-light"
                       [class.border-success]="horarioSeleccionado === opcion.valor"
                       [class.bg-success-subtle]="horarioSeleccionado === opcion.valor"
                       (click)="horarioSeleccionado = opcion.valor">
                    <div>
                      <strong class="d-block text-dark">{{ opcion.titulo }}</strong>
                      <small class="text-muted">{{ opcion.detalle }}</small>
                    </div>
                    <div class="form-check">
                       <input class="form-check-input" type="radio" name="horario" [checked]="horarioSeleccionado === opcion.valor">
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
             <div class="card-header bg-white border-bottom p-4">
               <h5 class="fw-bold mb-0"><span class="badge bg-dark rounded-circle me-2">3</span> Método de Pago</h5>
             </div>
             <div class="card-body p-4">
                
                <div class="row g-3 mb-4">
                   <div class="col-6">
                      <div class="option-card p-3 rounded-3 border cursor-pointer text-center transition-all"
                           [class.selected]="metodoSeleccionado === 'tarjeta'"
                           (click)="metodoSeleccionado = 'tarjeta'">
                         <i class="bi bi-credit-card-2-front fs-3 d-block mb-1"></i>
                         <span class="fw-bold small">Tarjeta</span>
                      </div>
                   </div>
                   <div class="col-6">
                      <div class="option-card p-3 rounded-3 border cursor-pointer text-center transition-all"
                           [class.selected]="metodoSeleccionado === 'yape'"
                           (click)="metodoSeleccionado = 'yape'">
                         <i class="bi bi-qr-code-scan fs-3 d-block mb-1"></i>
                         <span class="fw-bold small">Yape / Plin</span>
                      </div>
                   </div>
                </div>

                <div *ngIf="metodoSeleccionado === 'tarjeta'" class="animate-fade-in bg-light p-4 rounded-3 border">
                   <div class="d-flex justify-content-between align-items-center mb-3">
                      <small class="text-muted fw-bold">DATOS DE TARJETA</small>
                      <i class="bi bi-lock-fill text-success"></i>
                   </div>
                   <div class="mb-3">
                      <input type="text" class="form-control" placeholder="Número de Tarjeta (0000 0000 0000 0000)" [(ngModel)]="datosTarjeta.numero">
                   </div>
                   <div class="row g-2">
                      <div class="col-6"><input type="text" class="form-control" placeholder="MM/AA" [(ngModel)]="datosTarjeta.expira"></div>
                      <div class="col-6"><input type="text" class="form-control" placeholder="CVV" [(ngModel)]="datosTarjeta.cvv"></div>
                   </div>
                </div>

                <div *ngIf="metodoSeleccionado === 'yape'" class="text-center animate-fade-in bg-light p-4 rounded-3 border">
                   <div class="row align-items-center">
                      <div class="col-md-5 mb-3 mb-md-0">
                         <div class="bg-white p-2 rounded border d-inline-block shadow-sm">
                            <img src="yape-bartolo.jpeg" class="img-fluid rounded" style="max-width: 140px;" 
                                 onerror="this.src='https://via.placeholder.com/150?text=QR+Yape'">
                         </div>
                      </div>
                      <div class="col-md-7 text-md-start">
                         <h6 class="fw-bold mb-1">Escanea para pagar</h6>
                         <p class="mb-2 text-muted small">Titular: Abarrotes SAC</p>
                         <div class="h4 fw-bold text-success mb-3">Total: S/ {{ storeService.totalPagar() | number:'1.2-2' }}</div>
                         
                         <label class="small fw-bold text-muted d-block text-start mb-1">Código de Operación</label>
                         <input type="text" class="form-control" placeholder="Ej: 123456" [(ngModel)]="codigoYape">
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden sticky-top" style="top: 100px; z-index: 1;">
            <div class="card-header bg-dark text-white py-3">
               <h5 class="mb-0 fw-bold fs-6">Resumen del Pedido</h5>
            </div>
            <div class="card-body p-4">
               
               <div class="d-flex flex-column gap-3 mb-4" style="max-height: 300px; overflow-y: auto;">
                  <div class="d-flex align-items-center gap-3" *ngFor="let item of storeService.carrito()">
                     <div class="position-relative">
                        <img [src]="item.imagen" class="rounded border" style="width: 50px; height: 50px; object-fit: contain;">
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style="font-size: 0.6rem;">
                           {{ item.cantidadCarrito }}
                        </span>
                     </div>
                     <div class="flex-grow-1 lh-sm">
                        <div class="small fw-bold text-truncate" style="max-width: 150px;">{{ item.nombre }}</div>
                     </div>
                     <div class="small fw-bold">S/ {{ (item.precioOferta || item.precio) * item.cantidadCarrito! | number:'1.2-2' }}</div>
                  </div>
               </div>

               <hr class="border-secondary opacity-10">

               <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Subtotal</span>
                  <span class="fw-bold">S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
               </div>
               <div class="d-flex justify-content-between mb-4">
                  <span class="text-muted">Envío</span>
                  <span class="text-success fw-bold">Gratis</span>
               </div>

               <div class="d-flex justify-content-between mb-4 pt-3 border-top">
                  <span class="fs-5 fw-bold text-dark">Total</span>
                  <span class="fs-4 fw-bold text-success">S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
               </div>

               <button class="btn btn-success w-100 py-3 rounded-pill fw-bold shadow hover-scale d-flex align-items-center justify-content-center gap-2" 
                       [disabled]="cargando || !formularioValido()"
                       (click)="procesarPago()">
                  <span *ngIf="cargando" class="spinner-border spinner-border-sm"></span>
                  <i *ngIf="!cargando" class="bi bi-lock-fill"></i>
                  {{ cargando ? 'Procesando...' : 'Confirmar y Pagar' }}
               </button>
               
               <div class="text-center mt-3">
                  <small class="text-muted" style="font-size: 0.75rem;">
                     <i class="bi bi-shield-check me-1"></i> Transacción encriptada y segura.
                  </small>
               </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .option-card { transition: all 0.2s ease; background: #fff; }
    .option-card:hover { transform: translateY(-3px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .option-card.selected { border-color: #198754 !important; background-color: #f0fff4; color: #198754; }
    .hover-bg-light:hover { background-color: #f8f9fa; }
    .hover-scale:hover { transform: scale(1.02); }
    .cursor-pointer { cursor: pointer; }
    .transition-all { transition: all 0.2s ease; }
  `]
})
export class CheckoutPageComponent implements OnInit {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  firestore = inject(Firestore);
  router = inject(Router);

  celularCliente = '';
  usuarioTieneCelular = false;

  tipoEntrega: 'delivery' | 'recojo' | '' = '';
  direccionEntrega = '';
  opcionesHorarias: { titulo: string, detalle: string, valor: string }[] = [];
  horarioSeleccionado = '';

  metodoSeleccionado: 'tarjeta' | 'yape' = 'tarjeta';
  datosTarjeta = { numero: '', expira: '', cvv: '' };
  codigoYape = '';
  cargando = false;

  ngOnInit() {
    const usuario = this.authService.currentUserProfile();
    if (usuario && usuario.celular) {
      this.celularCliente = usuario.celular;
      this.usuarioTieneCelular = true; 
    }
  }

  seleccionarTipo(tipo: 'delivery' | 'recojo') {
    this.tipoEntrega = tipo;
    this.horarioSeleccionado = '';
    this.generarOpcionesHorarias(tipo);
  }

  generarOpcionesHorarias(tipo: 'delivery' | 'recojo') {
    const opciones = [];
    const hoy = new Date();
    const horaActual = hoy.getHours();

    opciones.push({
      titulo: 'Mañana por la mañana',
      detalle: '9:00 AM - 1:00 PM',
      valor: `Mañana (${hoy.getDate() + 1}/${hoy.getMonth() + 1}) - Mañana`
    });

    opciones.push({
      titulo: 'Mañana por la tarde',
      detalle: '2:00 PM - 6:00 PM',
      valor: `Mañana (${hoy.getDate() + 1}/${hoy.getMonth() + 1}) - Tarde`
    });

    opciones.push({
      titulo: 'Pasado mañana',
      detalle: 'Horario abierto (9am - 6pm)',
      valor: `Pasado mañana (${hoy.getDate() + 2}/${hoy.getMonth() + 1})`
    });

    if (tipo === 'recojo' && horaActual < 16) {
      opciones.unshift({
        titulo: 'Hoy mismo (Flash)',
        detalle: 'Listo en 2 horas',
        valor: `Hoy (${hoy.getDate()}/${hoy.getMonth() + 1}) - Express`
      });
    }

    this.opcionesHorarias = opciones;
  }

  formularioValido(): boolean {
    if (!this.celularCliente || this.celularCliente.length < 9) return false;
    
    if (!this.tipoEntrega) return false;
    if (!this.horarioSeleccionado) return false;
    if (this.tipoEntrega === 'delivery' && !this.direccionEntrega) return false;

    if (this.metodoSeleccionado === 'yape' && this.codigoYape.length < 6) return false;
    if (this.metodoSeleccionado === 'tarjeta' && this.datosTarjeta.numero.length < 10) return false;
    
    return true;
  }

  async procesarPago() {
    this.cargando = true;
    const usuario = this.authService.currentUserProfile();
    
    if (usuario && !this.usuarioTieneCelular && this.celularCliente) {
      try {
        const userRef = doc(this.firestore, `users/${usuario.uid}`);
        await updateDoc(userRef, { celular: this.celularCliente });
      } catch (e) {
        console.error("Error guardando celular", e);
      }
    }

    const nuevaOrden = {
      fecha: new Date(),
      usuarioId: usuario?.uid || 'invitado',
      usuarioNombre: usuario ? (usuario.nombre + ' ' + usuario.apellidos) : 'Invitado',
      email: usuario?.email || 'No registrado',
      celular: this.celularCliente,
      tipoEntrega: this.tipoEntrega,
      horarioEntrega: this.horarioSeleccionado,
      direccion: this.direccionEntrega || 'Recojo en tienda',
      productos: this.storeService.carrito(),
      total: this.storeService.totalPagar(),
      metodoPago: this.metodoSeleccionado,
      estado: 'pendiente',
      datosPago: this.metodoSeleccionado === 'yape' 
        ? { codigoOperacion: this.codigoYape } 
        : { tarjeta: '**** ' + this.datosTarjeta.numero.slice(-4) }
    };

    setTimeout(async () => {
      try {
        await this.storeService.guardarOrden(nuevaOrden);
        await this.storeService.descontarStock(this.storeService.carrito());
        this.storeService.vaciarCarrito();
        alert('¡Pedido Agendado! Te enviamos la confirmación a tu WhatsApp.');
        this.router.navigate(['/mis-compras']);
      } catch (error) {
        alert('Error al procesar');
      } finally {
        this.cargando = false;
      }
    }, 1500);
  }
}