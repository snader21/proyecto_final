import { Controller, Get, Param } from '@nestjs/common';
import { LugarService } from '../services/lugar.service';

@Controller('lugares')
export class LugarController {
  constructor(private readonly lugarService: LugarService) {}

  @Get()
  findAll() {
    return this.lugarService.findAllLugares();
  }

  @Get('ciudades')
  findLugaresByTipo() {
    return this.lugarService.findLugaresByTipo('Ciudad');
  }

  @Get('paises')
  findLugaresByTipoPais() {
    return this.lugarService.findLugaresByTipo('Pais');
  }

  @Get('paises/:id/ciudades')
  findLugaresByTipoCiudadAndPais(@Param('id') id: string) {
    return this.lugarService.findLugaresByTipoCiudadAndPais(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lugarService.findLugarById(id);
  }
}
