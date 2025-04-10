import { IsNotEmpty } from 'class-validator';

export class QueryInventarioDto {
  @IsNotEmpty({
    message: 'El patrón para el nombre del producto es requerido',
  })
  nombre_producto?: string;
}
