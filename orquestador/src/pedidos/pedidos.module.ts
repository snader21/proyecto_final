import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosPagoService } from './metodos-pago.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PedidosController, MetodosPagoController],
  providers: [PedidosService, MetodosPagoService],
  exports: [PedidosService, MetodosPagoService],
})
export class PedidosModule {}
