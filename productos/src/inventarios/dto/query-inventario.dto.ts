import { IsOptional, IsString } from 'class-validator';

export class QueryInventarioDto {
  @IsOptional()
  @IsString({
    message:
      'El patrón para el nombre del producto debe ser una cadena de texto',
  })
  nombre_producto?: string;
}
