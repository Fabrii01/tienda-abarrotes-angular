import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
// CORRECCIÓN AQUÍ: Agregamos 'addDoc' a la lista de imports
import { Firestore, doc, setDoc, getDoc, collection, collectionData, updateDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { Subscription, Observable } from 'rxjs';
import { PerfilUsuario } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Señal técnica (Firebase Auth)
  currentUser = signal<User | null>(null);
  
  // Datos reales del usuario (Nombre, Apellido, Rol...)
  currentUserProfile = signal<PerfilUsuario | null>(null);

  user$ = user(this.auth);
  subscription: Subscription;

  constructor() {
    this.subscription = this.user$.subscribe(async (usuario: User | null) => {
      this.currentUser.set(usuario);
      
      if (usuario) {
        await this.cargarPerfil(usuario.uid);
      } else {
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

  // CREAR USUARIO DESDE ADMIN (Solo crea el perfil en la BD)
  async crearUsuarioDesdeAdmin(datos: any) {
    const usersCollection = collection(this.firestore, 'users');
    
    // Ahora sí funcionará addDoc porque ya está importado arriba
    await addDoc(usersCollection, {
      ...datos,
      role: 'cliente',
      estado: 'activo', 
      fechaRegistro: new Date()
    });
  }

  // CAMBIAR ESTADO
  async cambiarEstadoUsuario(uid: string, nuevoEstado: 'activo' | 'inactivo') {
    const docRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(docRef, { estado: nuevoEstado });
  }

  // ELIMINAR USUARIO
  async eliminarUsuario(uid: string) {
    const docRef = doc(this.firestore, `users/${uid}`);
    await deleteDoc(docRef);
  }

  // REGISTRO NORMAL (Crea Auth + Perfil)
  async register(datos: any) {
    const credencial = await createUserWithEmailAndPassword(this.auth, datos.email, datos.pass);
    const uid = credencial.user.uid;
    
    const perfil: PerfilUsuario = {
      uid: uid,
      email: datos.email,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      dni: datos.dni,
      celular: datos.celular,
      role: 'cliente'
    };

    await setDoc(doc(this.firestore, `users/${uid}`), perfil);
    this.currentUserProfile.set(perfil);
  }

  // ACTUALIZAR PERFIL PROPIO
  async updateUserProfile(datosActualizados: any) {
    const uid = this.currentUser()?.uid;
    if (!uid) throw new Error('No hay usuario logueado');

    const docRef = doc(this.firestore, `users/${uid}`);
    
    await updateDoc(docRef, {
      nombre: datosActualizados.nombre,
      apellidos: datosActualizados.apellidos,
      dni: datosActualizados.dni,
      celular: datosActualizados.celular
    });

    this.currentUserProfile.update(prev => ({ ...prev!, ...datosActualizados }));
  }

  // OBTENER TODOS (Para Admin)
  obtenerTodosLosUsuarios() {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<any[]>;
  }

  // CAMBIAR ROL
  async actualizarRolUsuario(uid: string, nuevoRol: 'admin' | 'cliente') {
    const docRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(docRef, { role: nuevoRol });
  }

  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logout() {
    this.currentUserProfile.set(null); 
    return signOut(this.auth);
  }
}