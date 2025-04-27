import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MetaTrimestralDto {
  @IsNumber()
  idMeta?: number;

  @IsNumber()
  idPlan?: number;

  @IsString()
  idQ: string;

  @IsNumber()
  ano: number;

  @IsNumber()
  idVendedor: number;

  @IsNumber()
  metaVenta: number;
}

export class PlanVentasDto {
  @IsNumber()
  ano: number;

  @IsNumber()
  idVendedor: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetaTrimestralDto)
  metas: MetaTrimestralDto[];
}
