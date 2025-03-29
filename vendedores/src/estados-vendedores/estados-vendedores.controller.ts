import { Controller, Get, Param } from '@nestjs/common';
import { EstadosVendedoresService } from './estados-vendedores.service';

@Controller('estados-vendedores')
export class EstadosVendedoresController {
  constructor(
    private readonly estadosVendedoresService: EstadosVendedoresService,
  ) {}

  @Get()
  findAll() {
    return this.estadosVendedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosVendedoresService.findOne(+id);
  }
}
