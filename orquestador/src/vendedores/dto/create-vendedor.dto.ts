export class CreateVendedorDto {
  nombre: string;
  contrasena: string;
  correo: string;
  telefono: string;
  zonaId: string;
  estado: 'active' | 'inactive';
}
