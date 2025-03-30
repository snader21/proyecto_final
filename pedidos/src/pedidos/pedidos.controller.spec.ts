import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';

describe('PedidosController', () => {
  let controller: PedidosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PedidosController],
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

    controller = module.get<PedidosController>(PedidosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
