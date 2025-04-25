export class GetClienteDto {
  id_cliente: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  pais?: string;
  ciudad?: string;
  documento_identidad?: string;
  lat?: number;
  lng?: number;
  id_tipo_cliente: string;
  tipo_cliente_nombre: string;
}
