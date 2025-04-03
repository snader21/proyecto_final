export class CreateMovimientoInventarioDto {
  idProducto: string;
  idUbicacion: string;
  idPedido?: string;
  cantidad: number;
  tipoMovimiento: string;
  idUsuario: string;
  fechaRegistro: string;
}
