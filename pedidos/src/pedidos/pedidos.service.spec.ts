import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { PubSubService } from '../common/services/pubsub.service';
import { HttpModule } from '@nestjs/axios';
import { Repository, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { jest } from '@jest/globals';

describe('PedidosService', () => {
  let service: PedidosService;
  let mockPubSubService: { publishMessage: jest.Mock };
  let pedidoRepository: Repository<PedidoEntity>;
  let estadoPedidoRepository: Repository<EstadoPedidoEntity>;
  let metodoPagoRepository: Repository<MetodoPagoEntity>;

  beforeEach(async () => {
    mockPubSubService = {
      publishMessage: jest.fn(),
    };

    const createQueryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockImplementation(async () => [] as PedidoEntity[]),
    } as unknown as SelectQueryBuilder<PedidoEntity>;

    pedidoRepository = {
      find: jest.fn().mockImplementation(async () => [] as PedidoEntity[]),
      create: jest.fn().mockImplementation((entityLike) => entityLike as PedidoEntity),
      save: jest.fn().mockImplementation(async (entity) => entity as PedidoEntity),
      findOne: jest.fn().mockImplementation(async (options: FindOneOptions<PedidoEntity>) => null),
      createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock),
    } as unknown as Repository<PedidoEntity>;

    estadoPedidoRepository = {
      find: jest.fn().mockImplementation(async () => [] as EstadoPedidoEntity[]),
    } as unknown as Repository<EstadoPedidoEntity>;

    metodoPagoRepository = {
      find: jest.fn().mockImplementation(async () => [] as MetodoPagoEntity[]),
    } as unknown as Repository<MetodoPagoEntity>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(PedidoEntity),
          useValue: pedidoRepository,
        },
        {
          provide: getRepositoryToken(EstadoPedidoEntity),
          useValue: estadoPedidoRepository,
        },
        {
          provide: getRepositoryToken(MetodoEnvioEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(MetodoPagoEntity),
          useValue: metodoPagoRepository,
        },
        {
          provide: PubSubService,
          useValue: mockPubSubService,
        },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all pedidos', async () => {
      const mockPedidos = [
        { id_pedido: '1', estado: {}, pago: {}, envio: {} },
        { id_pedido: '2', estado: {}, pago: {}, envio: {} }
      ] as PedidoEntity[];
      const queryBuilder = pedidoRepository.createQueryBuilder();
      (queryBuilder.getMany as jest.Mock).mockImplementation(async () => mockPedidos);

      const result = await service.findAll();
      expect(result).toEqual(mockPedidos);
    });

    it('should apply filters when provided', async () => {
      const mockPedidos = [
        { id_pedido: '1', estado: {}, pago: {}, envio: {} }
      ] as PedidoEntity[];
      const filters = {
        numeroPedido: '1',
        estado: 2,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };
      const queryBuilder = pedidoRepository.createQueryBuilder();
      (queryBuilder.getMany as jest.Mock).mockImplementation(async () => mockPedidos);

      const result = await service.findAll(filters);
      expect(result).toEqual(mockPedidos);
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findAllMetodosPago', () => {
    it('should return all metodos de pago', async () => {
      const mockMetodos = [
        { id_metodo_pago: 'MP001', nombre: 'Efectivo' }
      ] as MetodoPagoEntity[];
      (metodoPagoRepository.find as jest.Mock).mockImplementation(async () => mockMetodos);

      const result = await service.findAllMetodosPago();
      expect(result).toEqual(mockMetodos);
      expect(metodoPagoRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a pedido', async () => {
      const dto = {
        id_pedido: '1',
        id_vendedor: 'V1',
        fecha_registro: new Date(),
        id_estado: 1,
        descripcion: '',
        id_cliente: '',
        id_metodo_pago: '',
        estado_pago: '',
        costo_envio: 0,
        id_metodo_envio: '',
        estado: {},
        pago: {},
        envio: {}
      } as PedidoEntity;
      const savedPedido = { ...dto } as PedidoEntity;
      (pedidoRepository.create as jest.Mock).mockImplementation(() => dto);
      (pedidoRepository.save as jest.Mock).mockImplementation(async () => savedPedido);
      (pedidoRepository.findOne as jest.Mock).mockImplementation(async () => savedPedido);

      const result = await service.create(dto);
      expect(result).toEqual(savedPedido);
      expect(pedidoRepository.create).toHaveBeenCalledWith(dto);
      expect(pedidoRepository.save).toHaveBeenCalledWith(dto);
      expect(pedidoRepository.findOne).toHaveBeenCalledWith({
        where: { id_pedido: savedPedido.id_pedido },
        relations: ['estado', 'pago', 'envio']
      });
      expect(mockPubSubService.publishMessage).toHaveBeenCalledWith({
        idPedido: dto.id_pedido
      });
    });

    it('should throw error if input is array', async () => {
      await expect(service.create([] as any)).rejects.toThrow('Solo se permite crear un pedido a la vez');
    });

    it('should throw error if not found after save', async () => {
      const dto = {
        id_pedido: '1',
        id_vendedor: 'V1',
        fecha_registro: new Date(),
        id_estado: 1,
        descripcion: '',
        id_cliente: '',
        id_metodo_pago: '',
        estado_pago: '',
        costo_envio: 0,
        id_metodo_envio: '',
        estado: {},
        pago: {},
        envio: {}
      } as PedidoEntity;
      (pedidoRepository.create as jest.Mock).mockImplementation(() => dto);
      (pedidoRepository.save as jest.Mock).mockImplementation(async () => dto);
      (pedidoRepository.findOne as jest.Mock).mockImplementation(async () => null);

      await expect(service.create(dto)).rejects.toThrow('Pedido no encontrado después de guardar');
    });

    it('should create pedido even if pubsub fails', async () => {
      const dto = {
        id_pedido: '1',
        id_vendedor: 'V1',
        fecha_registro: new Date(),
        id_estado: 1,
        descripcion: '',
        id_cliente: '',
        id_metodo_pago: '',
        estado_pago: '',
        costo_envio: 0,
        id_metodo_envio: '',
        estado: {},
        pago: {},
        envio: {}
      } as PedidoEntity;
      const savedPedido = { ...dto } as PedidoEntity;
      (pedidoRepository.create as jest.Mock).mockImplementation(() => dto);
      (pedidoRepository.save as jest.Mock).mockImplementation(async () => savedPedido);
      (pedidoRepository.findOne as jest.Mock).mockImplementation(async () => savedPedido);
      mockPubSubService.publishMessage.mockImplementation(async () => {
        throw new Error('PubSub error');
      });

      const result = await service.create(dto);
      expect(result).toEqual(savedPedido);
    });
  });

  describe('findByIdVendedor', () => {
    it('should return pedidos for a vendedor', async () => {
      const mockPedidos = [
        { id_pedido: '1', id_vendedor: 'V1', estado: {}, pago: {}, envio: {} }
      ] as PedidoEntity[];
      const queryBuilder = pedidoRepository.createQueryBuilder();
      (queryBuilder.getMany as jest.Mock).mockImplementation(async () => mockPedidos);

      const result = await service.findByIdVendedor('V1');
      expect(result).toEqual(mockPedidos);
      expect(queryBuilder.where).toHaveBeenCalledWith('pedido.id_vendedor = :idVendedor', { idVendedor: 'V1' });
    });

    it('should apply filters when provided', async () => {
      const mockPedidos = [
        { id_pedido: '1', id_vendedor: 'V1', estado: {}, pago: {}, envio: {} }
      ] as PedidoEntity[];
      const filters = {
        numeroPedido: '1',
        estado: 2,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };
      const queryBuilder = pedidoRepository.createQueryBuilder();
      (queryBuilder.getMany as jest.Mock).mockImplementation(async () => mockPedidos);

      const result = await service.findByIdVendedor('V1', filters);
      expect(result).toEqual(mockPedidos);
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findByIdCliente', () => {
    it('should return pedidos for a cliente', async () => {
      const mockPedidos = [
        { id_pedido: '1', id_cliente: 'C1', estado: {}, pago: {}, envio: {} }
      ] as PedidoEntity[];
      const queryBuilder = pedidoRepository.createQueryBuilder();
      (queryBuilder.getMany as jest.Mock).mockImplementation(async () => mockPedidos);

      const result = await service.findByIdCliente('C1');
      expect(result).toEqual(mockPedidos);
      expect(queryBuilder.where).toHaveBeenCalledWith('pedido.id_cliente = :idCliente', { idCliente: 'C1' });
    });

    it('should apply filters when provided', async () => {
      const mockPedidos = [
        { id_pedido: '1', id_cliente: 'C1', estado: {}, pago: {}, envio: {} }
      ] as PedidoEntity[];
      const filters = {
        numeroPedido: '1',
        estado: 2,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31'
      };
      const queryBuilder = pedidoRepository.createQueryBuilder();
      (queryBuilder.getMany as jest.Mock).mockImplementation(async () => mockPedidos);

      const result = await service.findByIdCliente('C1', filters);
      expect(result).toEqual(mockPedidos);
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findAllEstadoPedido', () => {
    it('should return all estados de pedido', async () => {
      const mockEstados = [
        { id_estado: 1, nombre: 'Pendiente', descripcion: 'Pedido pendiente' },
        { id_estado: 2, nombre: 'Aprobado', descripcion: 'Pedido aprobado' }
      ] as EstadoPedidoEntity[];
      (estadoPedidoRepository.find as jest.Mock).mockImplementation(async () => mockEstados);

      const result = await service.findAllEstadoPedido();
      expect(result).toEqual(mockEstados);
      expect(estadoPedidoRepository.find).toHaveBeenCalled();
    });
  });
});
