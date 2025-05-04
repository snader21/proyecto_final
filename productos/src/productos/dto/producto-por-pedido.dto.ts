import { IsString, IsNumber } from 'class-validator';

export class ProductoPorPedidoDto {
  @IsString()
  id_producto: string;

  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsString()
  sku: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  alto: number;

  @IsNumber()
  largo: number;

  @IsNumber()
  ancho: number;

  @IsNumber()
  peso: number;

  @IsNumber()
  cantidad: number;

  @IsString()
  id_bodega: string;

  @IsString()
  nombre_bodega: string;

  @IsString()
  direccion: string;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsString()
  tipo_movimiento: string;
}
