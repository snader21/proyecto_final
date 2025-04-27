import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crearPedido(@Body() dto: any) {
    return this.pedidosService.crearPedido(dto);
  }

  @Get(':idVendedor')
  async findByIdVendedor(@Param('idVendedor') idVendedor: string) {
    return await this.pedidosService.findByIdVendedor(idVendedor);
  }
}
