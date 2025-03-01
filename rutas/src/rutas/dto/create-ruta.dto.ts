import { CreateNodoRutaDto } from 'src/nodos-rutas/dto/create-nodo-ruta.dto';

export class CreateRutaDto {
  fecha: string;
  duracionEstimada: number;
  distanciaTotal: number;
  tipoRutaId: number;
  camionId: number;
  nodos: CreateNodoRutaDto[];
}
