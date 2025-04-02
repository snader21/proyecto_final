export interface Rol {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}

export interface CreateUsuario {
  nombre: string;
  correo: string;
  contrasena: string;
  roles: string[];
  estado: 'active' | 'inactive';
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  roles: Rol[];
  estado: boolean;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}
