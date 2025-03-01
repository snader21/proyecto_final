import { Controller, Get } from '@nestjs/common';
import { RutasService } from './rutas.service';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}
  @Get('calcular-ruta')
  calcularYGuardarRuta() {
    return this.rutasService.calcularYGuardarRuta();
  }
}
