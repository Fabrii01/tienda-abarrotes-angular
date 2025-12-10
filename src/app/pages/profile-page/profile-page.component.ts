import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0 pt-4 pb-0 text-center">
              <div class="d-inline-block p-3 rounded-circle bg-light mb-3">
                <i class="bi bi-person-circle display-1 text-secondary"></i>
              </div>
              <h4 class="fw-bold">Mi Perfil</h4>
              <p class="text-muted">{{ authService.currentUser()?.email }}</p>
            </div>

            <div class="card-body p-4">
              <form (ngSubmit)="guardarCambios()">
                
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">Nombre</label>
                    <input type="text" class="form-control" [(ngModel)]="datos.nombre" name="nombre" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">Apellidos</label>
                    <input type="text" class="form-control" [(ngModel)]="datos.apellidos" name="apellidos" required>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">DNI / Documento</label>
                  <input type="text" class="form-control" [(ngModel)]="datos.dni" name="dni">
                </div>

                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Celular</label>
                  <input type="tel" class="form-control" [(ngModel)]="datos.celular" name="celular">
                </div>

                <div class="d-grid gap-2 mt-4">
                  <button type="submit" class="btn btn-success fw-bold py-2" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Guardando...' : 'Actualizar Datos' }}
                  </button>
                </div>

                <div *ngIf="mensaje" class="alert alert-success mt-3 text-center small">
                  {{ mensaje }}
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ProfilePageComponent implements OnInit {
  authService = inject(AuthService);
  
  datos = { nombre: '', apellidos: '', dni: '', celular: '' };
  loading = false;
  mensaje = '';

  ngOnInit() {
    // Rellenamos el formulario con los datos actuales
    const perfil = this.authService.currentUserProfile();
    if (perfil) {
      this.datos = { 
        nombre: perfil.nombre, 
        apellidos: perfil.apellidos, 
        dni: perfil.dni, 
        celular: perfil.celular 
      };
    }
  }

  async guardarCambios() {
    this.loading = true;
    this.mensaje = '';
    try {
      await this.authService.updateUserProfile(this.datos);
      this.mensaje = '¡Datos actualizados correctamente!';
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    } finally {
      this.loading = false;
    }
  }
}