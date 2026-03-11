import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light animate-fade-in" style="background-image: url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1920&q=80'); background-size: cover; background-position: center;">
      
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>

      <div class="card border-0 shadow-lg rounded-4 position-relative z-1" style="max-width: 400px; width: 100%;">
        <div class="card-body p-5 text-center">
          
          <div class="mb-4">
            <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style="width: 70px; height: 70px;">
               <i class="bi bi-shield-lock-fill fs-1"></i>
            </div>
            <h3 class="fw-bold text-dark">Fatahi Admin</h3>
            <p class="text-muted small">Acceso exclusivo para administración</p>
          </div>

          <form (ngSubmit)="login()">
            <div class="form-floating mb-3 text-start">
              <input type="email" class="form-control bg-light border-0" id="email" [(ngModel)]="email" name="email" placeholder="name@example.com" required>
              <label for="email" class="text-muted"><i class="bi bi-envelope me-2"></i>Correo Electrónico</label>
            </div>
            
            <div class="form-floating mb-4 text-start">
              <input type="password" class="form-control bg-light border-0" id="password" [(ngModel)]="password" name="password" placeholder="Contraseña" required>
              <label for="password" class="text-muted"><i class="bi bi-key me-2"></i>Contraseña</label>
            </div>

            <button type="submit" class="btn btn-success btn-lg w-100 fw-bold rounded-pill shadow-sm mb-3" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
            </button>
            
            <a routerLink="/" class="text-muted small text-decoration-none hover-text-success">
              <i class="bi bi-arrow-left me-1"></i> Volver al catálogo
            </a>
          </form>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-text-success:hover { color: #198754 !important; }
    .form-floating > .form-control:focus { box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2); background-color: white !important; }
  `]
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  loading = false;

  async login() {
    this.loading = true;
    try {
      await this.authService.login(this.email, this.password);
      // Al entrar, la manda directo a su panel
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error(error);
      alert('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      this.loading = false;
    }
  }
}