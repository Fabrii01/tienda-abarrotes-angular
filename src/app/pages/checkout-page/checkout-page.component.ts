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
    <div class="container py-5">
      <h2 class="fw-bold mb-4">Finalizar Compra</h2>
      
      <div class="row g-5">
        
        <div class="col-md-7 col-lg-8">
          
          <div *ngIf="usuarioTieneCelular" class="alert alert-success border-0 d-flex align-items-center mb-4">
             <i class="bi bi-check-circle-fill me-2 fs-5"></i>
             <div>
               <strong>Datos de contacto verificados.</strong><br>
               <small>La boleta se enviará a tu número de WhatsApp registrado internamente.</small>
             </div>
          </div>

          <div class="card shadow-sm border-0 mb-4" *ngIf="!usuarioTieneCelular">
            <div class="card-header bg-white fw-bold py-3">1. Datos de Contacto</div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label small fw-bold">Número de Celular (WhatsApp)</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-whatsapp text-success"></i></span>
                  <input type="tel" class="form-control" 
                         placeholder="Ej: 999888777" 
                         [(ngModel)]="celularCliente" 
                         maxlength="9" required>
                </div>
                <div class="form-text text-muted">
                  Necesario para enviarte el comprobante.
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-white fw-bold py-3">2. Modalidad de Entrega</div>
            <div class="card-body">
              
              <ul class="nav nav-pills nav-fill mb-3">
                <li class="nav-item">
                  <button class="nav-link fw-bold border" 
                          [class.active]="tipoEntrega === 'delivery'"
                          [class.bg-white]="tipoEntrega !== 'delivery'"
                          (click)="seleccionarTipo('delivery')">
                    <i class="bi bi-truck me-2"></i>Delivery
                  </button>
                </li>
                <li class="nav-item">
                  <button class="nav-link fw-bold border ms-2" 
                          [class.active]="tipoEntrega === 'recojo'" 
                          [class.bg-white]="tipoEntrega !== 'recojo'"
                          (click)="seleccionarTipo('recojo')">
                    <i class="bi bi-shop me-2"></i>Recojo en Tienda
                  </button>
                </li>
              </ul>

              <div class="mb-4 animate-fade-in" *ngIf="tipoEntrega === 'delivery'">
                 <label class="form-label small fw-bold">Dirección de Entrega</label>
                 <input type="text" class="form-control" placeholder="Ej: Av. Larco 123..." [(ngModel)]="direccionEntrega">
              </div>

              <div *ngIf="tipoEntrega" class="animate-fade-in">
                <label class="form-label small fw-bold mb-2">Horarios Disponibles:</label>
                <div class="d-grid gap-2">
                  <div *ngFor="let opcion of opcionesHorarias" 
                       class="form-check card-radio p-3 border rounded cursor-pointer position-relative"
                       [class.border-success]="horarioSeleccionado === opcion.valor"
                       [class.bg-success-subtle]="horarioSeleccionado === opcion.valor"
                       (click)="horarioSeleccionado = opcion.valor">
                    <input class="form-check-input position-absolute top-50 end-0 me-3 mt-0" 
                           type="radio" name="horario" 
                           [checked]="horarioSeleccionado === opcion.valor">
                    <label class="form-check-label w-100 cursor-pointer">
                      <strong class="d-block">{{ opcion.titulo }}</strong>
                      <small class="text-muted">{{ opcion.detalle }}</small>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 mb-4">
             <div class="card-header bg-white fw-bold py-3">3. Método de Pago</div>
             <div class="card-body">
                <div class="btn-group w-100 mb-4" role="group">
                  <input type="radio" class="btn-check" name="metodo" id="tarjeta" [(ngModel)]="metodoSeleccionado" value="tarjeta">
                  <label class="btn btn-outline-primary fw-bold" for="tarjeta"><i class="bi bi-credit-card-2-front me-2"></i> Tarjeta</label>

                  <input type="radio" class="btn-check" name="metodo" id="yape" [(ngModel)]="metodoSeleccionado" value="yape">
                  <label class="btn btn-outline-primary fw-bold" for="yape"><i class="bi bi-qr-code me-2"></i> Yape</label>
                </div>

                <div *ngIf="metodoSeleccionado === 'tarjeta'" class="animate-fade-in">
                  <div class="alert alert-light border small"><i class="bi bi-lock"></i> Pagos procesados de forma segura.</div>
                  <div class="mb-3"><input type="text" class="form-control" placeholder="Número de Tarjeta" [(ngModel)]="datosTarjeta.numero"></div>
                  <div class="row">
                     <div class="col-6"><input type="text" class="form-control" placeholder="MM/AA" [(ngModel)]="datosTarjeta.expira"></div>
                     <div class="col-6"><input type="text" class="form-control" placeholder="CVV" [(ngModel)]="datosTarjeta.cvv"></div>
                  </div>
                </div>

                <div *ngIf="metodoSeleccionado === 'yape'" class="text-center animate-fade-in">
                  <div class="bg-light p-3 rounded d-inline-block border mb-3">
                     <img src="yape-bartolo.jpeg" style="width: 150px;" onerror="this.src='https://via.placeholder.com/150?text=QR+Yape'">
                  </div>
                  <div class="fw-bold mb-2">Total a pagar: S/ {{ storeService.totalPagar() | number:'1.2-2' }}</div>
                  <input type="text" class="form-control text-center" placeholder="Ingresa el Código de Operación" [(ngModel)]="codigoYape">
                </div>
             </div>
          </div>
        </div>

        <div class="col-md-5 col-lg-4">
          <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
            <div class="card-header bg-white py-3 fw-bold">Resumen del Pedido</div>
            <div class="card-body">
               <ul class="list-unstyled mb-4">
                 <li class="d-flex justify-content-between mb-2" *ngFor="let item of storeService.carrito()">
                   <span>{{ item.nombre }} <span class="text-muted small">x{{ item.cantidadCarrito }}</span></span>
                   <span class="fw-bold">S/ {{ (item.precioOferta || item.precio) * item.cantidadCarrito! | number:'1.2-2' }}</span>
                 </li>
                 <li class="border-top pt-3 mt-2 d-flex justify-content-between fs-5 fw-bold">
                   <span>Total</span>
                   <span>S/ {{ storeService.totalPagar() | number:'1.2-2' }}</span>
                 </li>
               </ul>

               <button class="btn btn-dark w-100 btn-lg fw-bold" 
                       [disabled]="cargando || !formularioValido()"
                       (click)="procesarPago()">
                 <span *ngIf="cargando" class="spinner-border spinner-border-sm me-2"></span>
                 {{ cargando ? 'Confirmando...' : 'Pagar Ahora' }}
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; } 
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .card-radio:hover { background-color: #f8f9fa; border-color: #198754; }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class CheckoutPageComponent implements OnInit {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  firestore = inject(Firestore);
  router = inject(Router);

  celularCliente = '';
  usuarioTieneCelular = false; // Bandera para saber si ocultamos el input

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
      // Si ya tiene celular, lo cargamos Y activamos la bandera para ocultar el input
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
    // Validamos celular (ya sea el oculto o el escrito)
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
    
    // Si el usuario no tenía celular y lo escribió ahora, lo guardamos para el futuro
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
      
      // Aquí va el celular (ya sea el interno o el nuevo)
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