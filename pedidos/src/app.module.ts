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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'pedidos',
      entities: [
        EstadoPedidoEntity,
        MetodoEnvioEntity,
        MetodoPagoEntity,
        PedidoEntity,
      ],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
