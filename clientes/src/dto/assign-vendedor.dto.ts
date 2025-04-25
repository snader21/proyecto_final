import { IsUUID, IsOptional, IsString } from 'class-validator';

export class AssignVendedorDto {
  @IsOptional()
  @IsUUID('4', { message: 'id_vendedor debe ser un UUID válido' })
  @IsString()
  id_vendedor?: string | null;
}
