import { ZonaDto } from './zona.dto';

export class VendedorDto {
  id: string;
  nombre: string;
  correo: string;
  estado: string;
  usuario_id: string;
  zona: ZonaDto;
}
