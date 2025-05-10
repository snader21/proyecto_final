import { Controller, Get, Param } from '@nestjs/common';
import { BodegasService } from './bodegas.service';

@Controller('bodegas')
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) {}

  @Get(':id')
  async getBodega(@Param('id') id: string) {
    return this.bodegasService.getBodega(id);
  }
}
