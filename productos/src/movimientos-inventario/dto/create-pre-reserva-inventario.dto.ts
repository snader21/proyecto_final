import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePreReservaInventarioDto {
  @IsUUID(4, {
    message: 'El producto debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'El producto es requerido',
  })
  idProducto: string;

  @IsUUID(4, {
    message: 'El pedido debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'El pedido es requerido',
  })
  idPedido: string;

  @IsNumber()
  @Min(1)
  @IsPositive({
    message: 'La cantidad debe ser un número positivo',
  })
  @IsNotEmpty({
    message: 'La cantidad es requerida',
  })
  cantidad: number;

  @IsUUID(4, {
    message: 'El usuario debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'El usuario es requerido',
  })
  idUsuario: string;

  @IsDateString()
  @IsNotEmpty({
    message: 'La fecha de movimiento es requerida',
  })
  fechaRegistro: string;
}
