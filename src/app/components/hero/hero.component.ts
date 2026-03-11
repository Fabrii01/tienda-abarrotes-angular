import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <div class="p-4 p-md-5 mb-4 bg-dark text-white rounded-4 shadow-lg position-relative overflow-hidden animate-fade-in" 
         style="background: linear-gradient(rgba(15, 81, 50, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center;">
      
      <div class="container-fluid py-4 py-md-5 position-relative z-2 text-center text-md-start">
        
        <span class="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold" style="letter-spacing: 1px;">
           <i class="bi bi-stars me-1"></i> NUEVA COLECCIÓN
        </span>
        
        <h1 class="display-4 fw-bold mb-3 text-white">Novedades Fatahi</h1>
        
        <p class="col-md-8 fs-5 text-white-50 mb-4 mx-auto mx-md-0" style="font-weight: 300;">
          Descubre nuestro catálogo exclusivo. Productos seleccionados de la mejor calidad, listos para ti.
        </p>
        
        <button class="btn btn-success btn-lg fw-bold rounded-pill px-5 shadow-sm hover-scale" type="button" (click)="scrollAbajo()">
          Explorar Catálogo <i class="bi bi-arrow-down-circle ms-2"></i>
        </button>
        
      </div>
    </div>
  `,
  styles: [`
    .hover-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .hover-scale:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HeroComponent {
  
  // Función para que el botón baje la pantalla hacia los productos
  scrollAbajo() {
    window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  }
  
}