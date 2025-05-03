import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { HttpModule } from '@nestjs/axios';
import { ProveedorAiModule } from '../proveedor-ai/proveedor-ai.module';
import { ProductosModule } from '../productos/productos.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ClientesModule } from '../clientes/clientes.module';
@Module({
  imports: [
    HttpModule,
    ProveedorAiModule,
    ProductosModule,
    PedidosModule,
    ClientesModule,
  ],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
