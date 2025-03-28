import { Test, TestingModule } from '@nestjs/testing';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ProductosModule } from '../productos/productos.module';
import { ProveedorAiService } from '../proveedor-ai/proveedor-ai.service';

describe('RutasController', () => {
  let controller: RutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProductosModule,
        PedidosModule,
      ],
      controllers: [RutasController],
      providers: [
        RutasService,
        {
          provide: ProveedorAiService,
          useValue: {
            enviarPrompt: jest.fn().mockResolvedValue({ content: '{}' }),
          },
        },
      ],
    }).compile();

    controller = module.get<RutasController>(RutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
