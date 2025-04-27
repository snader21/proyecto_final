import { Controller, Post, Body } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crearPedido(@Body() dto: any) {
    return this.pedidosService.crearPedido(dto);
  }
}
