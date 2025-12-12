import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      
      <div class="row g-5">
        
        <div class="col-md-7 col-lg-8">
          <h4 class="mb-3 fw-bold">Método de Pago</h4>
          
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              
              <div class="btn-group w-100 mb-4" role="group">
                <input type="radio" class="btn-check" name="metodo" id="tarjeta" autocomplete="off" 
                       [(ngModel)]="metodoSeleccionado" value="tarjeta" checked>
                <label class="btn btn-outline-primary py-3 fw-bold" for="tarjeta">
                  <i class="bi bi-credit-card-2-front me-2"></i> Tarjeta BCP / Débito
                </label>

                <input type="radio" class="btn-check" name="metodo" id="yape" autocomplete="off"
                       [(ngModel)]="metodoSeleccionado" value="yape">
                <label class="btn btn-outline-primary py-3 fw-bold" for="yape">
                  <i class="bi bi-qr-code me-2"></i> Yape
                </label>
              </div>

              <div *ngIf="metodoSeleccionado === 'tarjeta'" class="animate-fade-in">
                <div class="alert alert-info small mb-3">
                  <i class="bi bi-shield-lock me-2"></i> Tus datos están protegidos (Simulación).
                </div>
                
                <form (ngSubmit)="procesarPago()">
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label small fw-bold">Nombre en la tarjeta</label>
                      <input type="text" class="form-control" placeholder="Como aparece en el plástico" required [(ngModel)]="datosTarjeta.nombre" name="nombreTarj">
                    </div>

                    <div class="col-12">
                      <label class="form-label small fw-bold">Número de tarjeta</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-credit-card"></i></span>
                        <input type="text" class="form-control" placeholder="0000 0000 0000 0000" maxlength="19" required [(ngModel)]="datosTarjeta.numero" name="numTarj">
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label small fw-bold">Vencimiento</label>
                      <input type="text" class="form-control" placeholder="MM/AA" maxlength="5" required [(ngModel)]="datosTarjeta.expira" name="expira">
                    </div>

                    <div class="col-md-6">
                      <label class="form-label small fw-bold">CVV</label>
                      <input type="text" class="form-control" placeholder="123" maxlength="3" required [(ngModel)]="datosTarjeta.cvv" name="cvv">
                    </div>
                  </div>
                </form>
              </div>

              <div *ngIf="metodoSeleccionado === 'yape'" class="text-center animate-fade-in">
                <h5 class="fw-bold text-yape mb-3">¡Escanea y Yapea!</h5>
                
                <div class="bg-light p-3 d-inline-block rounded border mb-3 shadow-sm">
  <img src="yape-bartolo.jpeg" 
       alt="QR Yape" 
       style="width: 200px; height: 200px; object-fit: contain;"
       onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'">
</div>
                
                <p class="text-muted small mb-1">Monto a pagar:</p>
                <h2 class="text-dark fw-bold mb-4">S/ {{ storeService.totalPagar() | number:'1.2-2' }}</h2>

                <div class="text-start bg-light p-3 rounded border">
                  <label class="form-label small fw-bold text-muted">Ingresa el Código de Operación:</label>
                  <input type="text" class="form-control form-control-lg" placeholder="Ej: 123456" 
                         required [(ngModel)]="codigoYape" name="codYape">
                  <div class="form-text small">Lo encontrarás en la constancia de Yape.</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="col-md-5 col-lg-4">
          <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">Resumen de Compra</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between lh-sm" *ngFor="let item of storeService.carrito()">
                <div>
                  <h6 class="my-0">{{ item.nombre }}</h6>
                  <small class="text-muted">Cant: {{ item.cantidadCarrito }}</small>
                </div>
                <span class="text-muted">S/ {{ (obtenerPrecio(item) * item.cantidadCarrito!) | number:'1.2-2' }}</span>
              </li>
              
              <li class="list-group-item d-flex justify-content-between bg-light fw-bold">
                <span>Total (PEN)</span>
                <strong>S/ {{ storeService.totalPagar() | number:'1.2-2' }}</strong>
              </li>
            </ul>

            <div class="card-body">
              <button class="btn btn-success w-100 btn-lg fw-bold" 
                      [disabled]="cargando || (metodoSeleccionado === 'yape' && !codigoYape) || (metodoSeleccionado === 'tarjeta' && !datosTarjeta.numero)"
                      (click)="procesarPago()">
                <span *ngIf="cargando" class="spinner-border spinner-border-sm me-2"></span>
                {{ cargando ? 'Procesando...' : 'Confirmar Pago' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .text-yape { color: #742284; } /* Color morado Yape */
    .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CheckoutPageComponent {
  storeService = inject(StoreService);
  authService = inject(AuthService);
  router = inject(Router);

  metodoSeleccionado: 'tarjeta' | 'yape' = 'tarjeta';
  cargando = false;

  // Datos Temporales
  datosTarjeta = { nombre: '', numero: '', expira: '', cvv: '' };
  codigoYape = '';

  obtenerPrecio(item: any) {
    return (item.precioOferta && item.precioOferta < item.precio) ? item.precioOferta : item.precio;
  }

  async procesarPago() {
    this.cargando = true;

    // 1. Validar Usuario (Opcional: Si quieres permitir compra invitado, quita esto)
    const usuario = this.authService.currentUserProfile();
    if (!usuario) {
      alert('Por favor inicia sesión para guardar tu pedido');
      this.cargando = false;
      return;
    }

    // 2. Simulación de Tiempo de espera (2 segundos)
    setTimeout(async () => {
      
      // 3. Crear Objeto Orden
      const nuevaOrden = {
        fecha: new Date(),
        usuarioId: usuario.uid,
        usuarioNombre: usuario.nombre + ' ' + usuario.apellidos,
        email: usuario.email,
        productos: this.storeService.carrito(),
        total: this.storeService.totalPagar(),
        metodoPago: this.metodoSeleccionado,
        estado: 'pagado', // O 'pendiente' si es Yape y quieres validarlo manual
        datosPago: this.metodoSeleccionado === 'yape' ? { codigoOperacion: this.codigoYape } : { tarjeta: '**** ' + this.datosTarjeta.numero.slice(-4) }
      };

      try {
        // 1. Guardamos la orden (historial)
        await this.storeService.guardarOrden(nuevaOrden);
        
        // 2. >>> NUEVO: DESCONTAMOS EL STOCK <<<
        await this.storeService.descontarStock(this.storeService.carrito());

        // 3. Limpiamos carrito y redirigimos
        this.storeService.vaciarCarrito();
        alert('¡Pago Registrado! Validaremos tu operación en breve.');
        this.router.navigate(['/']);
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar el pedido.');
      } finally {
        this.cargando = false;
      }

    }, 2000);
  }
}