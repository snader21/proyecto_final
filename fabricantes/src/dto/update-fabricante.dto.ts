/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  MinLength,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
export enum EstadoFabricante {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}
export class UpdateFabricanteDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  nombre: string;

  @IsEmail()
  @IsOptional()
  correo: string;

  @IsString()
  @IsOptional()
  direccion: string;

  @IsEnum(EstadoFabricante)
  @IsOptional()
  estado: string;

  @IsString()
  @IsOptional()
  telefono: string;

  @IsString()
  @IsOptional()
  ciudad_id: string;

  @IsString()
  @IsOptional()
  pais_id: string;
}
