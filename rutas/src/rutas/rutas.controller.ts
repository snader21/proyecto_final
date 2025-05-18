import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RutasService } from './rutas.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { RutasVisitaVendedores } from './dto/rutas-visita-vendedores.dto';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Post('ruta-entrega-de-pedidos')
  createRutaDeEntregaDePedidos(@Body() createRutaDto: CreateRutaDto[]) {
    return this.rutasService.createRutaDeEntregaDePedidos(createRutaDto);
  }

  @Post('ruta-visita-vendedores')
  createRutaDeVisitaVendedores(@Body() createRutaDto: CreateRutaDto[]) {
    return this.rutasService.createRutaDeVisitaVendedores(createRutaDto);
  }

  @Get()
  async findAll(@Query('tipoRuta') tipoRuta?: 'entrega' | 'visita') {
    let tipoRutaNombre: string | undefined;
    if (tipoRuta === 'entrega') {
      tipoRutaNombre = 'Entrega de pedido';
    } else if (tipoRuta === 'visita') {
      tipoRutaNombre = 'Visita a cliente';
    }

    const rutas = await this.rutasService.findAll(tipoRutaNombre);
    return rutas;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.rutasService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutasService.remove(+id);
  }
}
