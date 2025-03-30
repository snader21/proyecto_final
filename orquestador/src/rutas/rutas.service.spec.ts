import { Test, TestingModule } from '@nestjs/testing';
import { RutasService } from './rutas.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from '../productos/productos.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ProveedorAiService } from '../proveedor-ai/proveedor-ai.service';

describe('RutasService', () => {
  let service: RutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ProductosModule,
        PedidosModule,
      ],
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

    service = module.get<RutasService>(RutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
