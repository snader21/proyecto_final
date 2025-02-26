import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { HttpModule } from '@nestjs/axios';
import { ProveedorAiModule } from 'src/proveedor-ai/ai-provider.module';
import { ProductosModule } from 'src/productos/productos.module';
import { PedidosModule } from 'src/pedidos/pedidos.module';

@Module({
  imports: [HttpModule, ProveedorAiModule, ProductosModule, PedidosModule],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
