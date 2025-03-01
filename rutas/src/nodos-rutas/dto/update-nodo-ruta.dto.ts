import { PartialType } from '@nestjs/mapped-types';
import { CreateNodoRutaDto } from './create-nodo-ruta.dto';

export class UpdateNodoRutaDto extends PartialType(CreateNodoRutaDto) {}
