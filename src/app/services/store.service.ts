import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Producto } from '../models/product.model';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, addDoc, updateDoc, query, where } from '@angular/fire/firestore';
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

  // --- ESTADOS (Signals) ---
  productos = signal<Producto[]>([]);
  categorias = signal<any[]>([]);
  marcas = signal<any[]>([]);
  carrito = signal<Producto[]>([]);
  favoritos = signal<string[]>([]);

  // Filtros
  categoriaSeleccionada = signal<string>('Todos');
  terminoBusqueda = signal<string>('');
  
  // Filtros Dinámicos
  soloOfertas = signal<boolean>(false);
  precioMaxSlider = signal<number | null>(null); 
  marcaSeleccionada = signal<string>('Todas');
  ordenarPor = signal<'defecto' | 'barato' | 'caro' | 'az' | 'za'>('defecto');

  constructor() {
    this.cargarProductosDesdeBD();
    this.cargarCategorias();
    this.cargarMarcas();

    effect(() => {
      const usuario = this.authService.currentUser();
      if (usuario) this.cargarFavoritos(usuario.uid);
      else this.favoritos.set([]);
    });
  }
  obtenerMisPedidos(uid: string) {
    const col = collection(this.firestore, 'orders');
    // Filtro: Traeme solo donde 'usuarioId' sea igual al UID que te paso
    const q = query(col, where('usuarioId', '==', uid));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  // --- 1. LÍMITES DE PRECIO INTELIGENTES ---
  limitesPrecio = computed(() => {
    const categoria = this.categoriaSeleccionada();
    const busqueda = this.terminoBusqueda().toLowerCase();
    const verOfertas = this.soloOfertas();
    
    const productosBase = this.productos().filter(p => {
      const matchCategoria = categoria === 'Todos' || p.categoria === categoria;
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda) || (p.marca && p.marca.toLowerCase().includes(busqueda));
      const matchOferta = verOfertas ? (p.precioOferta && p.precioOferta < p.precio) : true;
      return matchCategoria && matchBusqueda && matchOferta;
    });

    if (productosBase.length === 0) return { min: 0, max: 100 };

    const precios = productosBase.map(p => this.obtenerPrecio(p));

    return {
      min: Math.floor(Math.min(...precios)),
      max: Math.ceil(Math.max(...precios)) 
    };
  });

  // --- 2. FILTRADO MAESTRO ---
  productosFiltrados = computed(() => {
    const categoria = this.categoriaSeleccionada();
    const busqueda = this.terminoBusqueda().toLowerCase();
    const verOfertas = this.soloOfertas();
    const maxSlider = this.precioMaxSlider();
    const marca = this.marcaSeleccionada();
    const orden = this.ordenarPor();

    let lista = this.productos().filter(p => {
      const precioFinal = this.obtenerPrecio(p);
      const matchCategoria = categoria === 'Todos' || p.categoria === categoria;
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda) || (p.marca && p.marca.toLowerCase().includes(busqueda));
      const matchOferta = verOfertas ? (p.precioOferta && p.precioOferta < p.precio) : true;
      const matchPrecio = maxSlider === null || precioFinal <= maxSlider;
      const matchMarca = marca === 'Todas' || p.marca === marca;

      return matchCategoria && matchBusqueda && matchOferta && matchPrecio && matchMarca;
    });

    if (orden === 'barato') lista.sort((a, b) => this.obtenerPrecio(a) - this.obtenerPrecio(b));
    else if (orden === 'caro') lista.sort((a, b) => this.obtenerPrecio(b) - this.obtenerPrecio(a));
    else if (orden === 'az') lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else if (orden === 'za') lista.sort((a, b) => b.nombre.localeCompare(a.nombre));

    return lista;
  });

  private obtenerPrecio(p: Producto): number {
    return (p.precioOferta && p.precioOferta < p.precio) ? p.precioOferta : p.precio;
  }

  totalPagar = computed(() => {
    return this.carrito().reduce((acc, prod) => {
      const precio = this.obtenerPrecio(prod);
      const cantidad = prod.cantidadCarrito || 1;
      return acc + (precio * cantidad);
    }, 0);
  });

  // --- ACTIONS DE CARGA ---
  cargarProductosDesdeBD() {
    const col = collection(this.firestore, 'products');
    (collectionData(col, { idField: 'id' }) as Observable<any[]>).subscribe(data => this.productos.set(data));
  }
  cargarCategorias() {
    const col = collection(this.firestore, 'categories');
    (collectionData(col, { idField: 'id' }) as Observable<any[]>).subscribe(data => {
      this.categorias.set(data.sort((a, b) => a.nombre.localeCompare(b.nombre)));
    });
  }
  cargarMarcas() {
    const col = collection(this.firestore, 'brands');
    (collectionData(col, { idField: 'id' }) as Observable<any[]>).subscribe(data => {
      this.marcas.set(data.sort((a, b) => a.nombre.localeCompare(b.nombre)));
    });
  }
  
  // --- GESTIÓN ADMIN (CRUD + SLUGS) ---

  // NUEVO: Función auxiliar para crear URL amigable
  private generarSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .replace(/ /g, '-') // Espacios a guiones
      .replace(/[^\w-]+/g, ''); // Quitar caracteres raros
  }

  async crearProducto(datos: Producto) { 
      const usuario = this.authService.currentUser();
      const productoFinal = {
        ...datos,
        slug: this.generarSlug(datos.nombre), // <--- AQUÍ SE GENERA EL SLUG
        creadorId: usuario?.uid || 'anonimo',
        creadorEmail: usuario?.email || 'Desconocido',
        fechaCreacion: new Date()
      };
      
      const col = collection(this.firestore, 'products');
      await addDoc(col, productoFinal);
  }

  async actualizarProducto(id: string, datos: any) { 
    // Al editar, regeneramos el slug por si cambió el nombre
    const datosFinales = {
      ...datos,
      slug: this.generarSlug(datos.nombre)
    };
    const docRef = doc(this.firestore, `products/${id}`); 
    await updateDoc(docRef, datosFinales); 
  }

  async borrarProducto(id: string) { const r = doc(this.firestore, `products/${id}`); await deleteDoc(r); }
  
  async agregarOpcion(c: 'categories'|'brands', n: string) { await addDoc(collection(this.firestore, c), { nombre: n }); }
  async borrarOpcion(c: 'categories'|'brands', id: string) { await deleteDoc(doc(this.firestore, `${c}/${id}`)); }

  // --- UI ACTIONS ---
  cambiarCategoria(c: string) { this.categoriaSeleccionada.set(c); this.soloOfertas.set(false); this.precioMaxSlider.set(null); }
  activarSoloOfertas() { this.categoriaSeleccionada.set('Todos'); this.soloOfertas.set(true); this.precioMaxSlider.set(null); }
  buscarProducto(t: string) { this.terminoBusqueda.set(t); }
  agregarProducto(producto: Producto, cantidad: number = 1) {
    this.carrito.update(prev => {
      // 1. Buscamos si el producto ya está en el carrito
      const index = prev.findIndex(p => p.id === producto.id);

      if (index !== -1) {
        // A) SI EXISTE: Actualizamos su cantidadCarrito
        const nuevoCarrito = [...prev];
        const itemExistente = { ...nuevoCarrito[index] }; // Copia para no mutar directo
        
        // Sumamos lo que ya tenía + lo nuevo
        itemExistente.cantidadCarrito = (itemExistente.cantidadCarrito || 0) + cantidad;
        
        // Validación extra: Que no supere el stock
        if (itemExistente.stock && itemExistente.cantidadCarrito > itemExistente.stock) {
          itemExistente.cantidadCarrito = itemExistente.stock; // Topeamos al stock
        }

        nuevoCarrito[index] = itemExistente;
        return nuevoCarrito;
      } else {
        // B) NO EXISTE: Lo agregamos como nuevo con la cantidad inicial
        return [...prev, { ...producto, cantidadCarrito: cantidad }];
      }
    });
  }
  actualizarCantidadId(id: string, cambio: number) {
    this.carrito.update(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nuevaCant = (item.cantidadCarrito || 1) + cambio;
          // Validamos que no sea menor a 1 ni mayor al stock
          if (nuevaCant >= 1 && nuevaCant <= (item.stock || 999)) {
            return { ...item, cantidadCarrito: nuevaCant };
          }
        }
        return item;
      });
    });
  }
  eliminarProducto(i: number) { this.carrito.update(prev => { const n = [...prev]; n.splice(i, 1); return n; }); }

  resetearFiltros() {
    this.categoriaSeleccionada.set('Todos');
    this.terminoBusqueda.set('');
    this.soloOfertas.set(false);
    this.precioMaxSlider.set(null);
    this.marcaSeleccionada.set('Todas');
    this.ordenarPor.set('defecto');
  }
  async guardarOrden(orden: any) {
    const col = collection(this.firestore, 'orders');
    await addDoc(col, orden);
  }
  vaciarCarrito() {
    this.carrito.set([]);
  }
  obtenerOrdenes() {
    const col = collection(this.firestore, 'orders');
    // Traemos la data y ordenamos (idealmente por fecha en el backend, aquí lo haremos en el front)
    return collectionData(col, { idField: 'id' }) as Observable<any[]>;
  }

  // 2. ACTUALIZAR ESTADO DE ORDEN (Para aprobar el Yape)
  async actualizarEstadoOrden(id: string, nuevoEstado: 'pendiente' | 'pagado' | 'enviado') {
    const docRef = doc(this.firestore, `orders/${id}`);
    await updateDoc(docRef, { estado: nuevoEstado });
  }
  async descontarStock(productosCarrito: any[]) {
    for (const producto of productosCarrito) {
      // 1. Calculamos el nuevo stock
      const stockActual = producto.stock || 0;
      const cantidadComprada = producto.cantidadCarrito || 1;
      const nuevoStock = stockActual - cantidadComprada;

      // 2. Actualizamos en Firebase (protegiendo que no baje de 0)
      if (producto.id) {
        const docRef = doc(this.firestore, `products/${producto.id}`);
        await updateDoc(docRef, { 
          stock: nuevoStock >= 0 ? nuevoStock : 0 
        });
      }
    }
  }

  // --- FAVORITOS Y USUARIOS ---
  obtenerFavoritosDeUsuario(uid: string) {
    const favCollection = collection(this.firestore, `users/${uid}/favorites`);
    return collectionData(favCollection, { idField: 'id' }) as Observable<{id: string}[]>;
  }
  cargarFavoritos(uid: string) {
    const favCollection = collection(this.firestore, `users/${uid}/favorites`);
    (collectionData(favCollection, { idField: 'id' }) as Observable<{id: string}[]>)
      .subscribe(data => { this.favoritos.set(data.map(item => item.id)); });
  }
  async toggleFavorito(p: Producto) {
    const u = this.authService.currentUser();
    if (!u) { alert('Inicia sesión'); this.router.navigate(['/login']); return; }
    const docRef = doc(this.firestore, `users/${u.uid}/favorites/${p.id}`);
    if (this.esFavorito(p.id!)) await deleteDoc(docRef); else await setDoc(docRef, { fecha: new Date() });
  }
  esFavorito(id: string|number) { return this.favoritos().includes(id.toString()); }
}