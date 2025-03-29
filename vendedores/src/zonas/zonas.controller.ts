import { Controller, Get, Param } from '@nestjs/common';
import { ZonasService } from './zonas.service';
@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Get()
  findAll() {
    return this.zonasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonasService.findOne(+id);
  }
}
