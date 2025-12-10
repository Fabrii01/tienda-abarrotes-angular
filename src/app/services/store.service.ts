import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Producto } from '../models/product.model';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- ESTADOS ---
  categoriaSeleccionada = signal<string>('Todos');
  terminoBusqueda = signal<string>('');
  
  // 1. CAMBIO IMPORTANTE: Ya no hay lista fija. Empieza vacía.
  productos = signal<Producto[]>([]); 

  carrito = signal<Producto[]>([]);
  favoritos = signal<string[]>([]);

  constructor() {
    // Cargar productos REALES de la BD al iniciar
    this.cargarProductosDesdeBD();

    // Cargar favoritos si hay usuario
    effect(() => {
      const usuario = this.authService.currentUser();
      if (usuario) {
        this.cargarFavoritos(usuario.uid);
      } else {
        this.favoritos.set([]);
      }
    });
  }

  // --- LÓGICA FILTROS (Ahora usa la señal 'productos') ---
  
  productosFiltrados = computed(() => {
    const categoria = this.categoriaSeleccionada();
    const busqueda = this.terminoBusqueda().toLowerCase();

    // Usamos this.productos() que viene de Firebase
    return this.productos().filter(p => {
      const matchCategoria = categoria === 'Todos' || p.categoria === categoria;
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda);
      return matchCategoria && matchBusqueda;
    });
  });

  totalPagar = computed(() => {
    return this.carrito().reduce((acc, prod) => acc + prod.precio, 0);
  });

  // --- CONEXIÓN CON FIREBASE ---

  // A. Leer Productos (Público)
  cargarProductosDesdeBD() {
    const productsCollection = collection(this.firestore, 'products');
    // Escuchamos cambios en tiempo real
    (collectionData(productsCollection, { idField: 'id' }) as Observable<any[]>)
      .subscribe(data => {
        // Convertimos el ID a string/number según venga, por seguridad lo tratamos como parte del objeto
        const productosLimpio = data.map(p => ({
          ...p,
          id: p.id // Firestore nos da el ID aquí
        }));
        this.productos.set(productosLimpio);
      });
  }

  // B. Crear Producto (Solo Admin)
  async crearProducto(datos: Producto) {
    const productsCollection = collection(this.firestore, 'products');
    await addDoc(productsCollection, datos);
  }

  // --- MÉTODOS CARRITO Y UI ---

  cambiarCategoria(nuevaCategoria: string) {
    this.categoriaSeleccionada.set(nuevaCategoria);
  }

  buscarProducto(termino: string) {
    this.terminoBusqueda.set(termino);
  }

  agregarProducto(producto: Producto) {
    this.carrito.update(prev => [...prev, producto]);
  }

  eliminarProducto(index: number) {
    this.carrito.update(prev => {
      const nuevo = [...prev];
      nuevo.splice(index, 1);
      return nuevo;
    });
  }

  resetearFiltros() {
    this.categoriaSeleccionada.set('Todos');
    this.terminoBusqueda.set('');
  }

  // --- FAVORITOS ---
  
  cargarFavoritos(uid: string) {
    const favCollection = collection(this.firestore, `users/${uid}/favorites`);
    (collectionData(favCollection, { idField: 'id' }) as Observable<{id: string}[]>)
      .subscribe(data => {
        this.favoritos.set(data.map(item => item.id));
      });
  }

  async toggleFavorito(producto: Producto) {
    const usuario = this.authService.currentUser();
    if (!usuario) {
      alert('Debes iniciar sesión para guardar favoritos.');
      this.router.navigate(['/login']);
      return;
    }

    const uid = usuario.uid;
    const productoId = producto.id!.toString();
    const docRef = doc(this.firestore, `users/${uid}/favorites/${productoId}`);

    if (this.esFavorito(productoId)) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { fecha: new Date() });
    }
  }

  esFavorito(productoId: string | number): boolean {
    return this.favoritos().includes(productoId.toString());
  }
}