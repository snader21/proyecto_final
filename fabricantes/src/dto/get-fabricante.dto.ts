/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength, IsEmail, IsEnum } from 'class-validator';
export enum EstadoFabricante {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}
export class GetFabricanteDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(3)
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  direccion: string;

  @IsEnum(EstadoFabricante)
  estado: string;

  @IsString()
  telefono: string;

  @IsString()
  ciudad_id: string;

  @IsString()
  ciudad_nombre: string;

  @IsString()
  pais_id: string;

  @IsString()
  pais_nombre: string;
}
