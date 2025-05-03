import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { EstadoUsuario } from './create-usuario.dto';

export class UpdateUsuarioDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @MinLength(6)
  @IsOptional()
  contrasena?: string;

  @IsOptional()
  @IsArray()
  @IsOptional()
  roles?: string[];

  @IsEnum(EstadoUsuario)
  @IsOptional()
  estado?: EstadoUsuario;
}
