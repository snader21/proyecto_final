import { Controller } from '@nestjs/common';
import { RutasService } from './rutas.service';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}
}
