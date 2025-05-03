import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserVendedorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  correo: string;
}