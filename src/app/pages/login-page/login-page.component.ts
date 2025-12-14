import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid min-vh-100 d-flex p-0 overflow-hidden bg-white">
      
      <div class="d-none d-lg-flex col-lg-6 position-relative align-items-center justify-content-center bg-dark text-white p-5">
        <div class="position-absolute top-0 start-0 w-100 h-100" 
             style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop') center/cover;">
        </div>
        
        <div class="position-relative z-1 text-center" style="max-width: 400px;">
          <h2 class="display-5 fw-bold mb-4">La calidad que mereces</h2>
          <p class="lead text-white-50 mb-4">Únete a miles de clientes que reciben sus abarrotes frescos en la puerta de su casa cada semana.</p>
          <div class="d-flex gap-3 justify-content-center">
            <div class="d-flex align-items-center gap-2 small text-white-50">
              <i class="bi bi-shield-check fs-4 text-success"></i> Compra Segura
            </div>
            <div class="d-flex align-items-center gap-2 small text-white-50">
              <i class="bi bi-truck fs-4 text-primary"></i> Envíos Rápidos
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 overflow-auto">
        <div class="w-100 px-4 animate-fade-in" style="max-width: 450px;">
          
          <div class="text-center mb-5">
            <h1 class="fw-bold text-success mb-2 cursor-pointer" routerLink="/">
              Abarrotes<span class="text-dark">.com</span>
            </h1>
            <h4 class="fw-bold text-dark mt-4">
              {{ isLogin ? '¡Hola de nuevo! 👋' : 'Crea tu cuenta 🚀' }}
            </h4>
            <p class="text-muted">
              {{ isLogin ? 'Ingresa tus datos para continuar' : 'Rellena el formulario para empezar' }}
            </p>
          </div>

          <form (ngSubmit)="onSubmit()">
            
            <div *ngIf="!isLogin" class="animate-fade-in">
              <div class="row g-2">
                <div class="col-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0" id="nombre" [(ngModel)]="datos.nombre" name="nombre" placeholder="Nombre" required>
                    <label for="nombre">Nombre</label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0" id="apellidos" [(ngModel)]="datos.apellidos" name="apellidos" placeholder="Apellidos" required>
                    <label for="apellidos">Apellidos</label>
                  </div>
                </div>
              </div>

              <div class="row g-2">
                <div class="col-6">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0" id="dni" [(ngModel)]="datos.dni" name="dni" placeholder="DNI" required>
                    <label for="dni">DNI</label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-floating mb-3">
                    <input type="tel" class="form-control bg-light border-0" id="celular" [(ngModel)]="datos.celular" name="celular" placeholder="Celular" required>
                    <label for="celular">Celular</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-floating mb-3">
              <input type="email" class="form-control bg-light border-0" id="email" [(ngModel)]="datos.email" name="email" placeholder="name@example.com" required>
              <label for="email">Correo Electrónico</label>
            </div>

            <div class="form-floating mb-4 position-relative">
              <input [type]="mostrarPassword ? 'text' : 'password'" class="form-control bg-light border-0" id="password" [(ngModel)]="datos.pass" name="password" placeholder="Password" required>
              <label for="password">Contraseña</label>
              
              <button type="button" class="btn btn-link text-decoration-none text-muted position-absolute top-50 end-0 translate-middle-y me-2" 
                      (click)="mostrarPassword = !mostrarPassword">
                <i class="bi" [class.bi-eye]="!mostrarPassword" [class.bi-eye-slash]="mostrarPassword"></i>
              </button>
            </div>

            <div class="form-check mb-4" *ngIf="!isLogin">
              <input class="form-check-input" type="checkbox" id="terms" required>
              <label class="form-check-label small text-muted" for="terms">
                Acepto los <a href="#" class="text-success fw-bold text-decoration-none">Términos y Condiciones</a>
              </label>
            </div>

            <button type="submit" class="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm hover-scale mb-3">
              {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
            </button>

            <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center small py-2 mt-3 fade show" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              <div>{{ errorMessage }}</div>
            </div>

          </form>

          <div class="text-center mt-4">
            <span class="text-muted small">
              {{ isLogin ? '¿Nuevo en Abarrotes?' : '¿Ya tienes cuenta?' }}
            </span>
            <a class="text-success fw-bold text-decoration-none ms-1 cursor-pointer" (click)="toggleMode()">
              {{ isLogin ? 'Crear cuenta gratis' : 'Ingresa aquí' }}
            </a>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    /* Estilo para los inputs flotantes */
    .form-floating > .form-control:focus ~ label { color: #198754; }
    .form-floating > .form-control:focus { box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.15); }
    /* Efecto hover botón */
    .hover-scale { transition: transform 0.2s; }
    .hover-scale:hover { transform: scale(1.02); }
  `]
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isLogin = true;
  mostrarPassword = false;
  errorMessage = '';

  datos = {
    nombre: '',
    apellidos: '',
    dni: '',
    celular: '',
    email: '',
    pass: ''
  };

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  async onSubmit() {
    this.errorMessage = '';
    try {
      if (this.isLogin) {
        await this.authService.login(this.datos.email, this.datos.pass);
      } else {
        await this.authService.register(this.datos);
      }
      this.router.navigate(['/']); 
    } catch (error: any) {
      console.error(error);
      this.traducirError(error.code);
    }
  }

  traducirError(code: string) {
    switch(code) {
      case 'auth/email-already-in-use': this.errorMessage = 'Este correo ya está registrado.'; break;
      case 'auth/invalid-email': this.errorMessage = 'El correo no es válido.'; break;
      case 'auth/weak-password': this.errorMessage = 'La contraseña es muy débil (mín. 6 caracteres).'; break;
      case 'auth/invalid-credential': 
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        this.errorMessage = 'Correo o contraseña incorrectos.'; break;
      default: this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
    }
  }
}