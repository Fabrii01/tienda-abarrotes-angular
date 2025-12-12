export interface PerfilUsuario {
  uid: string;
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  celular: string;
  role: 'admin' | 'cliente';
  
  // AGREGAMOS ESTOS CAMPOS NUEVOS:
  estado?: 'activo' | 'inactivo'; // El ? es porque usuarios viejos quizás no lo tengan
  fechaRegistro?: any;
}