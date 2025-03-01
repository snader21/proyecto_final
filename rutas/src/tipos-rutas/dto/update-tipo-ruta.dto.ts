import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoRutaDto } from './create-tipo-ruta.dto';

export class UpdateTipoRutaDto extends PartialType(CreateTipoRutaDto) {}
