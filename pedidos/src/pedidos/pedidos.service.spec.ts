import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';

describe('PedidosService', () => {
  let service: PedidosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(PedidoEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(EstadoPedidoEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MetodoEnvioEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MetodoPagoEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
