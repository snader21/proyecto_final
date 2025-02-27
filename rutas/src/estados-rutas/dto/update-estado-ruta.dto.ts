import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoRutaDto } from './create-estado-ruta.dto';

export class UpdateEstadoRutaDto extends PartialType(CreateEstadoRutaDto) {}
