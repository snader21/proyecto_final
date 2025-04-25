import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { MetodosPagoController } from './metodos-pago.controller';
import { HttpModule } from '@nestjs/axios';
import { PedidoEntity } from './entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PedidoEntity,
      EstadoPedidoEntity,
      MetodoEnvioEntity,
      MetodoPagoEntity,
    ]),
    HttpModule,
  ],
  controllers: [PedidosController, MetodosPagoController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}
