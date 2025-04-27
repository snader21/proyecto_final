import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { PubSubService } from '../common/services/pubsub.service';

describe('PedidosController', () => {
  let controller: PedidosController;

  beforeEach(async () => {
    const mockPubSubService = {
      publishMessage: jest.fn(),
    } as any;
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
        {
          provide: PubSubService,
          useValue: mockPubSubService,
        },
      ],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all pedidos', async () => {
      const mockPedidos = [{ id_pedido: '1' }, { id_pedido: '2' }];
      const pedidosService = controller['pedidosService'];
      pedidosService.findAll = jest.fn().mockResolvedValue(mockPedidos);
      const result = await controller.findAll();
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a pedido', async () => {
      const dto = { id_pedido: '1', id_vendedor: 'V1' };
      const pedidosService = controller['pedidosService'];
      pedidosService.create = jest.fn().mockResolvedValue(dto);
      const result = await controller.create(dto as any);
      expect(result).toEqual(dto);
      expect(pedidosService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findByIdVendedor', () => {
    it('should return pedidos for a vendedor', async () => {
      const mockPedidos = [{ id_pedido: '1', id_vendedor: 'V1' }];
      const pedidosService = controller['pedidosService'];
      pedidosService.findByIdVendedor = jest.fn().mockResolvedValue(mockPedidos);
      const result = await controller.findByIdVendedor('V1');
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findByIdVendedor).toHaveBeenCalledWith('V1');
    });
  });
});
