import { CreateNodoProductoDto } from '../../nodos-productos/dto/create-nodo-producto.dto';

export class CreateNodoRutaDto {
  numeroNodoProgramado: number;
  latitud: number;
  longitud: number;
  productos: CreateNodoProductoDto[];
}
