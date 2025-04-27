import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosPagoService } from './metodos-pago.service';
import { MetodosEnvioController } from './metodos-envio.controller';
import { MetodosEnvioService } from './metodos-envio.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PedidosController, MetodosPagoController, MetodosEnvioController],
  providers: [PedidosService, MetodosPagoService, MetodosEnvioService],
  exports: [PedidosService, MetodosPagoService, MetodosEnvioService],
})
export class PedidosModule {}
