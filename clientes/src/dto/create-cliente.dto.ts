/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  id_tipo_cliente: string;

  @IsNotEmpty()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsNotEmpty()
  @IsString()
  documento_identidad?: string;

  @IsNotEmpty()
  @IsDecimal({}, { message: 'Latitud debe ser un número decimal' })
  lat?: number;

  @IsNotEmpty()
  @IsDecimal({}, { message: 'Longitud debe ser un número decimal' })
  lng?: number;
}
