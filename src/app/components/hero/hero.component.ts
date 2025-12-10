import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <div class="p-5 mb-4 bg-dark text-white rounded-3 shadow" 
         style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'); background-size: cover; background-position: center;">
      <div class="container-fluid py-3">
        <h1 class="display-5 fw-bold">Ofertas de Fin de Semana</h1>
        <p class="col-md-8 fs-4">Los mejores abarrotes frescos y al mejor precio directo a tu hogar.</p>
        <button class="btn btn-warning btn-lg fw-bold" type="button">Ver Ofertas</button>
      </div>
    </div>
  `
})
export class HeroComponent {}