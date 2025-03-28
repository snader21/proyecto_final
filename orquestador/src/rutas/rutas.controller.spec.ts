import { Test, TestingModule } from '@nestjs/testing';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProveedorAiModule } from '../proveedor-ai/proveedor-ai.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ProductosModule } from '../productos/productos.module';

describe('RutasController', () => {
  let controller: RutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProveedorAiModule,
        ProductosModule,
        PedidosModule,
      ],
      controllers: [RutasController],
      providers: [RutasService],
    }).compile();

    controller = module.get<RutasController>(RutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
