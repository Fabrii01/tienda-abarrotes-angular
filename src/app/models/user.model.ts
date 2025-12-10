export interface PerfilUsuario {
  uid: string;
  email: string;
  nombre: string;
  apellidos: string;
  dni: string;
  celular: string;
  role: 'admin' | 'cliente';
}