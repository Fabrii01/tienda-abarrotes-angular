export interface Producto {
  id?: string;
  nombre: string;
  slug?: string;
  precio: number;
  imagen: string;
  categoria: string;
  marca?: string;
  descripcion?: string;
  stock?: number;
  precioOferta?: number;
  creadorEmail?: string;
  creadorId?: string;
  fechaCreacion?: any;
  
  cantidadCarrito?: number; 
}