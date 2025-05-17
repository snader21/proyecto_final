import { Controller, Get, Post, Query } from '@nestjs/common';
import { RutasService } from './rutas.service';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}
  @Post('calcular-ruta-entrega-de-pedidos')
  calcularYGuardarRutaEntregaDePedidos() {
    return this.rutasService.calcularYGuardarRutaDeEntregaDePedidos();
  }

  @Post('calcular-ruta-visita-vendedores')
  calcularYGuardarRutaVisitaVendedores() {
    return this.rutasService.calcularYGuardarRutaDeVisitaDeVendedores();
  }

  @Get()
  obtenerListaRutas(@Query('tipoRuta') tipoRuta: string) {
    return this.rutasService.obtenerListaRutas(tipoRuta);
  }
}
