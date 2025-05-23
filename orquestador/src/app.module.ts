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
import { UsuariosModule } from './usuarios/usuarios.module';
import { FabricantesModule } from './fabricantes/fabricantes.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReportsModule } from './reports/reports.module';
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
    UsuariosModule,
    FabricantesModule,
    ClientesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
