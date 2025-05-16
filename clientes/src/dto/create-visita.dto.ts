import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateVisitaDto {
  @IsUUID()
  id_cliente: string;

  @IsDateString()
  fecha_visita: Date;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsBoolean()
  realizo_pedido: boolean;
}
