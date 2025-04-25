export class GetClienteDto {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  id_vendedor?: string | null;
}
