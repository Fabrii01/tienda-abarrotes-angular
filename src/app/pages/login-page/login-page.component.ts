import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      
      <div class="card border-0 shadow-sm p-4" style="max-width: 500px; width: 100%;">
        
        <div class="text-center mb-4">
          <h3 class="fw-bold text-success">
            {{ isLogin ? 'Inicia Sesión' : 'Regístrate' }}
          </h3>
          <p class="text-muted small">
            {{ isLogin ? 'Ingresa a tu cuenta para comprar' : 'Completa tus datos como en Falabella' }}
          </p>
        </div>

        <form (ngSubmit)="onSubmit()">
          
          <div *ngIf="!isLogin">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Nombre</label>
                <input type="text" class="form-control" [(ngModel)]="datos.nombre" name="nombre" placeholder="Ej: Juan" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Apellidos</label>
                <input type="text" class="form-control" [(ngModel)]="datos.apellidos" name="apellidos" placeholder="Ej: Pérez" required>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">DNI / Documento</label>
                <input type="text" class="form-control" [(ngModel)]="datos.dni" name="dni" placeholder="Número de DNI" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label small fw-bold">Celular</label>
                <input type="tel" class="form-control" [(ngModel)]="datos.celular" name="celular" placeholder="+51 999..." required>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Correo Electrónico</label>
            <input type="email" class="form-control" [(ngModel)]="datos.email" name="email" placeholder="nombre@ejemplo.com" required>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Contraseña</label>
            <div class="input-group">
               <input [type]="mostrarPassword ? 'text' : 'password'" class="form-control border-end-0" [(ngModel)]="datos.pass" name="password" placeholder="Mínimo 6 caracteres" required>
               <span class="input-group-text bg-white border-start-0 cursor-pointer" (click)="mostrarPassword = !mostrarPassword">
                 <i class="bi" [class.bi-eye]="!mostrarPassword" [class.bi-eye-slash]="mostrarPassword"></i>
               </span>
            </div>
          </div>

          <div class="mb-3 form-check" *ngIf="!isLogin">
            <input type="checkbox" class="form-check-input" id="checkTerms" required>
            <label class="form-check-label small text-muted" for="checkTerms">
              Acepto los <span class="text-success text-decoration-underline">términos y condiciones</span> y la política de privacidad.
            </label>
          </div>

          <button type="submit" class="btn btn-success w-100 py-2 fw-bold mb-3 rounded-pill">
            {{ isLogin ? 'Ingresar' : 'Registrarme' }}
          </button>
        </form>

        <div class="text-center pt-3 border-top">
          <small class="text-muted">
            {{ isLogin ? '¿No tienes cuenta aún?' : '¿Ya tienes cuenta?' }}
            <a href="javascript:void(0)" class="text-success fw-bold text-decoration-none" (click)="toggleMode()">
              {{ isLogin ? 'Créala aquí' : 'Inicia sesión aquí' }}
            </a>
          </small>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger mt-3 small text-center fade show">
          {{ errorMessage }}
        </div>

      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    input:focus { border-color: #198754; box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25); }
  `]
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isLogin = true;
  mostrarPassword = false;
  errorMessage = '';

  // Objeto único para guardar todo
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
        // LOGIN (Solo usa email y pass)
        await this.authService.login(this.datos.email, this.datos.pass);
      } else {
        // REGISTRO (Usa todo el objeto)
        await this.authService.register(this.datos);
      }
      this.router.navigate(['/']); // Ir al home si todo sale bien
    } catch (error: any) {
      console.error(error);
      this.traducirError(error.code);
    }
  }

  traducirError(code: string) {
    switch(code) {
      case 'auth/email-already-in-use': this.errorMessage = 'El correo ya está registrado.'; break;
      case 'auth/invalid-email': this.errorMessage = 'Correo inválido.'; break;
      case 'auth/weak-password': this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.'; break;
      case 'auth/invalid-credential': this.errorMessage = 'Correo o contraseña incorrectos.'; break;
      default: this.errorMessage = 'Ocurrió un error. Intenta nuevamente.';
    }
  }
}