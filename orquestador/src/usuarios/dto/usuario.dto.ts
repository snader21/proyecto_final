export class UsuarioDto {
  id: string;
  nombre: string;
  correo: string;
  contrasena: string;
  estado: string;
  roles: RolDto[];
}

export class RolDto {
  id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}
