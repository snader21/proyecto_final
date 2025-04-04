import { Controller } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}
}
