import { CreateNodoRutaDto } from '../../nodos-rutas/dto/create-nodo-ruta.dto';

export class CreateRutaDto {
  duracionEstimada: number;
  fecha: string;
  distanciaTotal: number;
  camionId?: string;
  vendedor_id?: string | null;
  nodos: CreateNodoRutaDto[];
}
