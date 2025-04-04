import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';

import { IsString } from 'class-validator';
import { TipoMovimientoEnum } from '../enums/tipo-movimiento.enum';

export class CreateMovimientoInventarioDto {
  @IsUUID(4, {
    message: 'El producto debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'El producto es requerido',
  })
  idProducto: string;

  @IsUUID(4, {
    message: 'La ubicación debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'La ubicación es requerida',
  })
  idUbicacion: string;

  @IsOptional()
  @IsUUID(4, {
    message: 'El pedido debe ser un uuid v4',
  })
  idPedido?: string;

  @IsNumber()
  @Min(1)
  @IsPositive({
    message: 'La cantidad debe ser un número positivo',
  })
  @IsNotEmpty({
    message: 'La cantidad es requerida',
  })
  cantidad: number;

  @IsString()
  @IsIn(['Entrada', 'Salida'], {
    message: 'El tipo de movimiento debe ser "Entrada" o "Salida"',
  })
  @IsNotEmpty({
    message: 'El tipo de movimiento es requerido',
  })
  tipoMovimiento: TipoMovimientoEnum;

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
