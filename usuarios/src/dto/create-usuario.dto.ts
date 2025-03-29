import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

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
}
