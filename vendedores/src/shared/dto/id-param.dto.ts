import { IsUUID } from 'class-validator';

export class UUIDParamDto {
  @IsUUID('4', {
    message: 'El id debe ser un UUID v4',
  })
  id: string;
}
