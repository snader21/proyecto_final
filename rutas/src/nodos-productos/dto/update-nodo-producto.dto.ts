import { PartialType } from '@nestjs/mapped-types';
import { CreateNodoProductoDto } from './create-nodo-producto.dto';

export class UpdateNodoProductoDto extends PartialType(CreateNodoProductoDto) {}
