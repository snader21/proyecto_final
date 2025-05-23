import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosEnvioController } from './metodos-envio.controller';
import { MetodosEnvioService } from './metodos-envio.service';
import { HttpModule } from '@nestjs/axios';
import { PedidoEntity } from './entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PedidoEntity,
      EstadoPedidoEntity,
      MetodoEnvioEntity,
      MetodoPagoEntity,
    ]),
    HttpModule,
    CommonModule
  ],
  controllers: [
    PedidosController,
    MetodosPagoController,
    MetodosEnvioController,
  ],
  providers: [
    PedidosService,
    MetodosEnvioService,
  ],
  exports: [PedidosService],
})
export class PedidosModule {}
