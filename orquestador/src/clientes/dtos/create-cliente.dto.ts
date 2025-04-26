/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  contrasena: string;

  @IsString()
  documento_identidad: string;

  @IsString()
  telefono: string;

  @IsString()
  direccion?: string;

  @IsString()
  id_tipo_cliente: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsUUID()
  id_vendedor?: string | null;
}
