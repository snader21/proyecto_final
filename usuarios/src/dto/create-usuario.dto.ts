import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

export enum EstadoUsuario {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsEmail()
  correo: string;

  @MinLength(6)
  contrasena: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsEnum(EstadoUsuario)
  estado?: EstadoUsuario;
}
