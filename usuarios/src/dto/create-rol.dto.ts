import { IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permisos?: string[];
}
