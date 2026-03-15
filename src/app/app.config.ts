import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// IMPORTS DE FIREBASE
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app'; // <--- Se añadió getApp
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

// 1. NUEVOS IMPORTS DE FIRESTORE PARA EL CACHÉ
import { provideFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from '@angular/fire/firestore'; 
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    
    // Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    // Proveer Autenticación y Storage
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),

    // 2. AQUÍ ESTÁ LA MAGIA: Inicializamos Firestore con Caché Persistente
    provideFirestore(() => {
      const app = getApp();
      return initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
    }) 
    
  ]
};