import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-whatsapp',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a *ngIf="!esRutaAdmin()" 
       [href]="whatsappLink" 
       target="_blank" 
       class="whatsapp-float shadow-lg d-flex align-items-center justify-content-center text-decoration-none"
       title="¡Chatea con nosotros!">
      <i class="bi bi-whatsapp"></i>
    </a>
  `,
  styles: [`
    .whatsapp-float {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      background-color: #25d366;
      color: #fff;
      border-radius: 50%;
      font-size: 30px;
      z-index: 1000; /* Para que flote sobre todo */
      transition: all 0.3s ease;
    }

    .whatsapp-float:hover {
      background-color: #128c7e;
      transform: scale(1.1); /* Efecto de crecimiento */
      box-shadow: 0 10px 15px rgba(0,0,0,0.3) !important;
    }
  `]
})
export class FloatingWhatsappComponent {
  private router = inject(Router);

  // TU NÚMERO
  miNumero = '51925414135'; 

  get whatsappLink(): string {
    const mensaje = "Hola Abarrotes.com, tengo una consulta sobre un producto.";
    return `https://wa.me/${this.miNumero}?text=${encodeURIComponent(mensaje)}`;
  }

  // Ocultar en admin para que no estorbe
  esRutaAdmin(): boolean {
    return this.router.url.includes('/admin');
  }
}