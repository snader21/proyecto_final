import { Controller } from '@nestjs/common';
import { BodegasService } from './bodegas.service';

@Controller('bodegas')
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) {}
}
