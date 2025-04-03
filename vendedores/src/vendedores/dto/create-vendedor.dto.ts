import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVendedorDto {
  @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
  @IsNotEmpty({
    message: 'El nombre es requerido',
  })
  nombre: string;

  @IsEmail(
    {},
    {
      message: 'El correo debe ser una dirección de correo electrónico válida',
    },
  )
  @IsNotEmpty({
    message: 'El correo es requerido',
  })
  correo: string;

  @IsString({
    message: 'El teléfono debe ser una cadena de caracteres',
  })
  @IsNotEmpty({
    message: 'El teléfono es requerido',
  })
  telefono: string;

  @IsUUID(4, {
    message: 'La zona debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'La zona es requerida',
  })
  zonaId: string;

  @IsUUID(4, {
    message: 'El usuario debe ser un uuid v4',
  })
  @IsNotEmpty({
    message: 'El usuario es requerido',
  })
  usuarioId: string;
}
