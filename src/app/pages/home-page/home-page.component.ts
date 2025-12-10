import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroComponent, ProductListComponent], // Ya no importamos Sidebar aquí
  template: `
    <div class="container pb-5">
      <app-hero></app-hero>

      <div class="mt-4 mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
         <h4 class="fw-bold mb-0 text-dark">Oportunidades Únicas</h4>
         <span class="badge bg-danger">¡OFERTAS!</span>
      </div>

      <app-product-list></app-product-list>
    </div>
  `
})
export class HomePageComponent {}