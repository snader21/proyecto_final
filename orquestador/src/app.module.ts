import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RutasModule } from './rutas/rutas.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProveedorAiModule } from './proveedor-ai/proveedor-ai.module';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { AuthModule } from './auth/auth.module';
import { VendedoresModule } from './vendedores/vendedores.module';

@Module({
  imports: [
    RutasModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProveedorAiModule,
    ProductosModule,
    PedidosModule,
    AuthModule,
    VendedoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
