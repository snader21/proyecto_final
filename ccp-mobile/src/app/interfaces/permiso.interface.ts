export interface Permiso {
  id: string;
  nombre: string;
  modulo: string;
  ruta: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  roles: any[];
  permisos: Permiso[];
} 