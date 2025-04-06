/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { FabricantesService } from './fabricantes.service';

@Controller('fabricantes')
export class FabricantesController {
  constructor(private readonly fabricantesService: FabricantesService) {}

  @Get('ciudades')
  async getCiudades() {
    return this.fabricantesService.getCiudades();
  }

  @Get('paises')
  async getPaises() {
    return this.fabricantesService.getPaises();
  }

  @Get('paises/:pais/ciudades')
  async getCiudadesByPais(@Param('pais') pais: string) {
    return this.fabricantesService.getCiudadesByPais(pais);
  }

  @Get()
  async getFabricantes() {
    return this.fabricantesService.getFabricantes();
  }

  @Get(':id')
  async getFabricante(@Param('id') id: string) {
    return this.fabricantesService.getFabricante(id);
  }

  @Post()
  async createFabricante(@Body() fabricante: any) {
    return this.fabricantesService.createFabricante(fabricante);
  }

  @Put(':id')
  async updateFabricante(@Param('id') id: string, @Body() fabricante: any) {
    return this.fabricantesService.updateFabricante(id, fabricante);
  }
}
