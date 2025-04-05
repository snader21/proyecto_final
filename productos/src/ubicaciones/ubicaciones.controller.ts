import { Controller, Get } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { UbicacionEntity } from './entities/ubicacion.entity';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  @Get()
  async obtenerUbicaciones(): Promise<UbicacionEntity[]> {
    return this.ubicacionesService.obtenerUbicaciones();
  }
}
