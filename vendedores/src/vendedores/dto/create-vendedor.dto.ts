import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

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

  @IsNumber(
    {},
    {
      message: 'La zona debe ser un número',
    },
  )
  @IsNotEmpty({
    message: 'La zona es requerida',
  })
  zonaId: number;

  @IsNumber(
    {},
    {
      message: 'El estado debe ser un número',
    },
  )
  @IsNotEmpty({
    message: 'El estado es requerido',
  })
  estadoId: number;

  @IsNumber(
    {},
    {
      message: 'El usuario debe ser un número',
    },
  )
  @IsNotEmpty({
    message: 'El usuario es requerido',
  })
  usuarioId: number;
}
