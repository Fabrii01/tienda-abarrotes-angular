import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5 animate-fade-in">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8 col-xl-6">
          
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            
            <div class="position-relative bg-dark" style="height: 120px; background: linear-gradient(135deg, #212529, #343a40);">
               <div class="position-absolute top-0 end-0 p-3">
                 <span class="badge bg-success bg-opacity-25 text-white border border-success border-opacity-25 rounded-pill px-3">Cuenta Activa</span>
               </div>
            </div>
            
            <div class="card-body p-4 pt-0 text-center position-relative">
               <div class="d-inline-flex justify-content-center align-items-center bg-white rounded-circle p-1 shadow-sm position-absolute top-0 start-50 translate-middle" style="width: 100px; height: 100px;">
                  <div class="w-100 h-100 rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold display-4">
                     {{ obtenerIniciales() }}
                  </div>
               </div>

               <div class="mt-5 pt-3 mb-4">
                  <h3 class="fw-bold mb-0">{{ datos.nombre }} {{ datos.apellidos }}</h3>
                  <p class="text-muted small">{{ authService.currentUser()?.email }}</p>
               </div>

               <hr class="border-secondary opacity-10 my-4">

               <form (ngSubmit)="guardarCambios()" class="text-start">
                 
                 <h6 class="fw-bold text-uppercase text-muted small mb-3 ls-1">Información Personal</h6>
                 
                 <div class="row g-3 mb-3">
                   <div class="col-md-6">
                     <div class="form-floating">
                       <input type="text" class="form-control bg-light border-0" id="nombre" [(ngModel)]="datos.nombre" name="nombre" placeholder="Nombre" required>
                       <label for="nombre">Nombre</label>
                     </div>
                   </div>
                   <div class="col-md-6">
                     <div class="form-floating">
                       <input type="text" class="form-control bg-light border-0" id="apellidos" [(ngModel)]="datos.apellidos" name="apellidos" placeholder="Apellidos" required>
                       <label for="apellidos">Apellidos</label>
                     </div>
                   </div>
                 </div>

                 <div class="row g-3 mb-4">
                   <div class="col-md-6">
                     <div class="form-floating">
                       <input type="text" class="form-control bg-light border-0" id="dni" [(ngModel)]="datos.dni" name="dni" placeholder="DNI">
                       <label for="dni">DNI / Documento</label>
                     </div>
                   </div>
                   <div class="col-md-6">
                     <div class="form-floating">
                       <input type="tel" class="form-control bg-light border-0" id="celular" [(ngModel)]="datos.celular" name="celular" placeholder="Celular">
                       <label for="celular">Celular</label>
                     </div>
                   </div>
                 </div>

                 <div class="d-grid">
                   <button type="submit" class="btn btn-dark btn-lg rounded-pill fw-bold shadow-sm hover-scale" [disabled]="loading">
                     <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                     {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                   </button>
                 </div>

                 <div *ngIf="mensaje" class="alert alert-success d-flex align-items-center mt-3 border-0 bg-success bg-opacity-10 text-success rounded-3 animate-fade-in">
                    <i class="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>{{ mensaje }}</div>
                 </div>

               </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 1px; }
    .hover-scale:hover { transform: translateY(-2px); }
    /* Ajuste para inputs flotantes */
    .form-floating > .form-control:focus ~ label { color: #212529; }
    .form-floating > .form-control:focus { box-shadow: 0 0 0 0.25rem rgba(33, 37, 41, 0.15); }
  `]
})
export class ProfilePageComponent implements OnInit {
  authService = inject(AuthService);
  
  datos = { nombre: '', apellidos: '', dni: '', celular: '' };
  loading = false;
  mensaje = '';

  ngOnInit() {
    const perfil = this.authService.currentUserProfile();
    if (perfil) {
      this.datos = { 
        nombre: perfil.nombre || '', 
        apellidos: perfil.apellidos || '', 
        dni: perfil.dni || '', 
        celular: perfil.celular || '' 
      };
    }
  }

  obtenerIniciales(): string {
    const n = this.datos.nombre ? this.datos.nombre.charAt(0) : '';
    const a = this.datos.apellidos ? this.datos.apellidos.charAt(0) : '';
    return (n + a).toUpperCase() || 'U';
  }

  async guardarCambios() {
    this.loading = true;
    this.mensaje = '';
    try {
      await this.authService.updateUserProfile(this.datos);
      this.mensaje = '¡Tus datos se han actualizado correctamente!';
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => this.mensaje = '', 3000);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    } finally {
      this.loading = false;
    }
  }
}