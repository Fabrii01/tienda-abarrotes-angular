import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { PerfilUsuario } from '../models/user.model'; // Asegúrate de tener este modelo creado
import { updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Señal técnica (Firebase Auth)
  currentUser = signal<User | null>(null);
  
  // NUEVA SEÑAL: Datos reales del usuario (Nombre, Apellido, Rol...)
  currentUserProfile = signal<PerfilUsuario | null>(null);

  user$ = user(this.auth);
  subscription: Subscription;

  constructor() {
    this.subscription = this.user$.subscribe(async (usuario: User | null) => {
      this.currentUser.set(usuario);
      
      if (usuario) {
        // Si hay usuario, descargamos sus datos de la colección 'users'
        await this.cargarPerfil(usuario.uid);
      } else {
        // Si no hay usuario, limpiamos el perfil
        this.currentUserProfile.set(null);
      }
    });
  }

  // Método auxiliar para bajar los datos de Firestore
  async cargarPerfil(uid: string) {
    try {
      const docRef = doc(this.firestore, `users/${uid}`);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data() as PerfilUsuario;
        this.currentUserProfile.set(data);
      }
    } catch (e) {
      console.error('Error cargando perfil:', e);
    }
  }

  // Registro (Igual que antes)
  async register(datos: any) {
    const credencial = await createUserWithEmailAndPassword(this.auth, datos.email, datos.pass);
    const uid = credencial.user.uid;
    
    // Guardamos en Firestore
    const perfil: PerfilUsuario = {
      uid: uid,
      email: datos.email,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      dni: datos.dni,
      celular: datos.celular,
      role: 'cliente' // Por defecto
    };

    await setDoc(doc(this.firestore, `users/${uid}`), perfil);
    
    // Actualizamos la señal manualmente para no esperar a la recarga
    this.currentUserProfile.set(perfil);
  }
  async updateUserProfile(datosActualizados: any) {
    const uid = this.currentUser()?.uid;
    if (!uid) throw new Error('No hay usuario logueado');

    const docRef = doc(this.firestore, `users/${uid}`);
    
    // Actualizamos solo los campos que nos manden en Firestore
    await updateDoc(docRef, {
      nombre: datosActualizados.nombre,
      apellidos: datosActualizados.apellidos,
      dni: datosActualizados.dni,
      celular: datosActualizados.celular
    });

    // Actualizamos la señal localmente para ver el cambio al instante
    this.currentUserProfile.update(prev => ({ ...prev!, ...datosActualizados }));
  }

  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logout() {
    this.currentUserProfile.set(null); // Limpiamos perfil al salir
    return signOut(this.auth);
  }
}