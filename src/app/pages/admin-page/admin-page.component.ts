import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          
          <div class="card border-0 shadow-lg">
            <div class="card-header bg-dark text-white p-3">
              <h4 class="mb-0"><i class="bi bi-box-seam me-2"></i>Panel de Administración</h4>
            </div>
            
            <div class="card-body p-4">
              <h5 class="mb-4 text-muted">Agregar Nuevo Producto</h5>

              <form (ngSubmit)="onSubmit()">
                
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Nombre del Producto</label>
                    <input type="text" class="form-control" [(ngModel)]="nuevoProducto.nombre" name="nombre" placeholder="Ej: Arroz Costeño" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Categoría</label>
                    <select class="form-select" [(ngModel)]="nuevoProducto.categoria" name="categoria" required>
                      <option value="" disabled selected>Selecciona una...</option>
                      <option value="Granos">Granos y Arroz</option>
                      <option value="Aceites">Aceites</option>
                      <option value="Lácteos">Lácteos</option>
                      <option value="Frutas">Frutas y Verduras</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Limpieza">Limpieza</option>
                    </select>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Precio (S/)</label>
                    <input type="number" class="form-control" [(ngModel)]="nuevoProducto.precio" name="precio" placeholder="0.00" step="0.10" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold">URL de la Imagen</label>
                    <input type="text" class="form-control" [(ngModel)]="nuevoProducto.imagen" name="imagen" placeholder="https://..." required>
                    <div class="form-text">Pega un enlace de imagen (luego aprenderemos a subir archivos).</div>
                  </div>
                </div>

                <div class="alert alert-light border d-flex align-items-center mb-4" *ngIf="nuevoProducto.nombre">
                  <img [src]="nuevoProducto.imagen || 'https://via.placeholder.com/50'" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                  <div>
                    <strong>{{ nuevoProducto.nombre }}</strong> <br>
                    <span class="text-success fw-bold">S/ {{ nuevoProducto.precio }}</span>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg fw-bold" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Guardando...' : 'Publicar Producto' }}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class AdminPageComponent {
  storeService = inject(StoreService);
  router = inject(Router);
  
  loading = false;

  nuevoProducto = {
    nombre: '',
    precio: 0,
    categoria: '',
    imagen: ''
  };

  async onSubmit() {
    if (this.nuevoProducto.precio <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    this.loading = true;
    try {
      await this.storeService.crearProducto(this.nuevoProducto);
      alert('¡Producto agregado correctamente!');
      
      // Limpiar formulario
      this.nuevoProducto = { nombre: '', precio: 0, categoria: '', imagen: '' };
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar.');
    } finally {
      this.loading = false;
    }
  }
}