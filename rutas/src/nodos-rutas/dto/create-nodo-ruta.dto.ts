import { CreateNodoProductoDto } from '../../nodos-productos/dto/create-nodo-producto.dto';

export class CreateNodoRutaDto {
  numeroNodoProgramado: number;
  latitud: number;
  longitud: number;
  hora_llegada: string;
  hora_salida: string;
  id_bodega?: string | null;
  id_cliente?: string | null;
  id_pedido?: string | null;
  direccion: string;
  productos: CreateNodoProductoDto[];
}
