import { Controller, Get } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  findAll() {
    return this.pedidosService.findAllMetodosPago();
  }
}
