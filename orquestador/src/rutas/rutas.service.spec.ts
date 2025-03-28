import { Test, TestingModule } from '@nestjs/testing';
import { RutasService } from './rutas.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProveedorAiModule } from '../proveedor-ai/proveedor-ai.module';
import { ProductosModule } from '../productos/productos.module';
import { PedidosModule } from '../pedidos/pedidos.module';

describe('RutasService', () => {
  let service: RutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProveedorAiModule,
        ProductosModule,
        PedidosModule,
      ],
      providers: [RutasService],
    }).compile();

    service = module.get<RutasService>(RutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
