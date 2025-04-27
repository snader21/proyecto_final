import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MetaTrimestralDto {
  idMeta?: string;
  idPlan?: string;

  @IsString()
  idQ: string;

  @IsNumber()
  ano: number;

  @IsString()
  idVendedor: string;

  @IsNumber()
  metaVenta: number;
}

export class PlanVentasDto {
  @IsNumber()
  ano: number;

  @IsString()
  idVendedor: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetaTrimestralDto)
  metas: MetaTrimestralDto[];
}
