export interface CreateVisitaDto {
  id_cliente: string;
  fecha_visita: Date;
  observaciones?: string;
  realizo_pedido: boolean;
  key_object_storage?: string | null;
  url?: string | null;
}
