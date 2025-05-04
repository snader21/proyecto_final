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
import { Repository } from 'typeorm';
import { FilterPedidoDto } from './dto/filter-pedido.dto';

describe('PedidosController', () => {
  let controller: PedidosController;
  let pedidosService: PedidosService;

  const mockPedido: PedidoEntity = {
    id_pedido: '1',
    id_vendedor: 'V1',
    fecha_registro: new Date(),
    id_estado: 1,
    descripcion: '',
    id_cliente: 'C1',
    id_metodo_pago: '1',
    estado_pago: 'Pendiente',
    costo_envio: 0,
    id_metodo_envio: '1',
    estado: {} as EstadoPedidoEntity,
    pago: {} as MetodoPagoEntity,
    envio: {} as MetodoEnvioEntity
  };

  beforeEach(async () => {
    const mockPubSubService = {
      publishMessage: jest.fn(),
    };

    const mockPedidoRepository = {
      find: jest.fn().mockResolvedValue([mockPedido]),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockPedido]),
      }),
    } as unknown as Repository<PedidoEntity>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PedidosController],
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(PedidoEntity),
          useValue: mockPedidoRepository,
        },
        {
          provide: getRepositoryToken(EstadoPedidoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(MetodoEnvioEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(MetodoPagoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: PubSubService,
          useValue: mockPubSubService,
        },
      ],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
    pedidosService = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all pedidos', async () => {
      const mockPedidos = [mockPedido];
      jest.spyOn(pedidosService, 'findAll').mockResolvedValue(mockPedidos);

      const result = await controller.findAll();
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findAll).toHaveBeenCalledWith({
        numeroPedido: undefined,
        estado: undefined,
        fechaInicio: undefined,
        fechaFin: undefined
      });
    });

    it('should return filtered pedidos', async () => {
      const mockPedidos = [mockPedido];
      const filters: FilterPedidoDto = {
        numeroPedido: '1',
        estado: 2,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };
      jest.spyOn(pedidosService, 'findAll').mockResolvedValue(mockPedidos);

      const result = await controller.findAll(JSON.stringify(filters));
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('create', () => {
    it('should create a pedido', async () => {
      jest.spyOn(pedidosService, 'create').mockResolvedValue(mockPedido);

      const result = await controller.create(mockPedido);
      expect(result).toEqual(mockPedido);
      expect(pedidosService.create).toHaveBeenCalledWith(mockPedido);
    });
  });

  describe('findByIdVendedor', () => {
    it('should return pedidos for a vendedor', async () => {
      const mockPedidos = [mockPedido];
      jest.spyOn(pedidosService, 'findByIdVendedor').mockResolvedValue(mockPedidos);

      const result = await controller.findByIdVendedor('V1');
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findByIdVendedor).toHaveBeenCalledWith('V1', {
        numeroPedido: undefined,
        estado: undefined,
        fechaInicio: undefined,
        fechaFin: undefined
      });
    });

    it('should return filtered pedidos for a vendedor', async () => {
      const mockPedidos = [mockPedido];
      const filters: FilterPedidoDto = {
        numeroPedido: '1',
        estado: 2,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };
      jest.spyOn(pedidosService, 'findByIdVendedor').mockResolvedValue(mockPedidos);

      const result = await controller.findByIdVendedor('V1', JSON.stringify(filters));
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findByIdVendedor).toHaveBeenCalledWith('V1', filters);
    });
  });

  describe('findByIdCliente', () => {
    it('should return pedidos for a cliente', async () => {
      const mockPedidos = [mockPedido];
      jest.spyOn(pedidosService, 'findByIdCliente').mockResolvedValue(mockPedidos);

      const result = await controller.findByIdCliente('C1');
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findByIdCliente).toHaveBeenCalledWith('C1', {
        numeroPedido: undefined,
        estado: undefined,
        fechaInicio: undefined,
        fechaFin: undefined
      });
    });

    it('should return filtered pedidos for a cliente', async () => {
      const mockPedidos = [mockPedido];
      const filters: FilterPedidoDto = {
        numeroPedido: '1',
        estado: 2,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };
      jest.spyOn(pedidosService, 'findByIdCliente').mockResolvedValue(mockPedidos);

      const result = await controller.findByIdCliente('C1', JSON.stringify(filters));
      expect(result).toEqual(mockPedidos);
      expect(pedidosService.findByIdCliente).toHaveBeenCalledWith('C1', filters);
    });
  });
});
