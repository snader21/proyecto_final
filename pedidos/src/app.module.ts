import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PedidosModule } from './pedidos/pedidos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoPedidoEntity } from './pedidos/entities/estado-pedido.entity';
import { MetodoEnvioEntity } from './pedidos/entities/metodo-envio.entity';
import { MetodoPagoEntity } from './pedidos/entities/metodo-pago.entity';
import { PedidoEntity } from './pedidos/entities/pedido.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PedidosModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'pedidos',
      entities: [EstadoPedidoEntity, MetodoEnvioEntity, MetodoPagoEntity, PedidoEntity],
      dropSchema: true,
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
