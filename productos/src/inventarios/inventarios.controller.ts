import { Controller } from '@nestjs/common';
import { InventariosService } from './inventarios.service';

@Controller('inventarios')
export class InventariosController {
  constructor(private readonly inventariosService: InventariosService) {}
}
