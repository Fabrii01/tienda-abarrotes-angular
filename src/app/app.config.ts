import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// IMPORTS DE FIREBASE
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // <--- 1. IMPORTAR ESTO
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    
    // Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    // Proveer Autenticación
    provideAuth(() => getAuth()),

    // 2. AGREGAR ESTA LÍNEA (Es la que suele faltar y causa la pantalla blanca)
    provideFirestore(() => getFirestore()) 
  ]
};