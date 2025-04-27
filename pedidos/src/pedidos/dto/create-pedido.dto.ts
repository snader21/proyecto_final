export class CreatePedidoDto {
  id_pedido: string;
  id_vendedor: string;
  fecha_registro: Date;
  id_estado: number;
  descripcion: string;
  id_cliente: string;
  id_metodo_pago: string;
  estado_pago: string;
  costo_envio: number;
  id_metodo_envio: string;
}
