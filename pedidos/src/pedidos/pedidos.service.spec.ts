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

  describe('findAll', () => {
    it('should return all pedidos', async () => {
      const mockPedidos = [{ id_pedido: '1' }, { id_pedido: '2' }];
      const pedidoRepository = service['pedidoRepository'];
      pedidoRepository.find = jest.fn().mockResolvedValue(mockPedidos);
      const result = await service.findAll();
      expect(result).toEqual(mockPedidos);
      expect(pedidoRepository.find).toHaveBeenCalledWith({ relations: ['estado', 'pago', 'envio'] });
    });
  });

  describe('findAllMetodosPago', () => {
    it('should return all metodos de pago', async () => {
      const mockMetodos = [{ id_metodo_pago: 'MP001' }];
      const metodoPagoRepository = service['metodoPagoRepository'];
      metodoPagoRepository.find = jest.fn().mockResolvedValue(mockMetodos);
      const result = await service.findAllMetodosPago();
      expect(result).toEqual(mockMetodos);
      expect(metodoPagoRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a pedido', async () => {
      const dto = { id_pedido: '1', id_vendedor: 'V1', fecha_registro: new Date(), id_estado: 1, descripcion: '', id_cliente: '', id_metodo_pago: '', estado_pago: '', costo_envio: 0, id_metodo_envio: '' };
      const savedPedido = { ...dto };
      const pedidoRepository = service['pedidoRepository'];
      pedidoRepository.create = jest.fn().mockReturnValue(dto);
      pedidoRepository.save = jest.fn().mockResolvedValue(savedPedido);
      pedidoRepository.findOne = jest.fn().mockResolvedValue(savedPedido);
      const result = await service.create(dto as any);
      expect(result).toEqual(savedPedido);
      expect(pedidoRepository.create).toHaveBeenCalledWith(dto);
      expect(pedidoRepository.save).toHaveBeenCalledWith(dto);
      expect(pedidoRepository.findOne).toHaveBeenCalledWith({ where: { id_pedido: savedPedido.id_pedido }, relations: ['estado', 'pago', 'envio'] });
    });
    it('should throw error if input is array', async () => {
      await expect(service.create([] as any)).rejects.toThrow('Solo se permite crear un pedido a la vez');
    });
    it('should throw error if not found after save', async () => {
      const dto = { id_pedido: '1', id_vendedor: 'V1', fecha_registro: new Date(), id_estado: 1, descripcion: '', id_cliente: '', id_metodo_pago: '', estado_pago: '', costo_envio: 0, id_metodo_envio: '' };
      const pedidoRepository = service['pedidoRepository'];
      pedidoRepository.create = jest.fn().mockReturnValue(dto);
      pedidoRepository.save = jest.fn().mockResolvedValue(dto);
      pedidoRepository.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(service.create(dto as any)).rejects.toThrow('Pedido no encontrado después de guardar');
    });
  });

  describe('findByIdVendedor', () => {
    it('should return pedidos for a vendedor', async () => {
      const mockPedidos = [{ id_pedido: '1', id_vendedor: 'V1' }];
      const pedidoRepository = service['pedidoRepository'];
      pedidoRepository.find = jest.fn().mockResolvedValue(mockPedidos);
      const result = await service.findByIdVendedor('V1');
      expect(result).toEqual(mockPedidos);
      expect(pedidoRepository.find).toHaveBeenCalledWith({ where: { id_vendedor: 'V1' }, relations: ['estado', 'pago', 'envio'] });
    });
    it('should throw error if repository throws', async () => {
      const pedidoRepository = service['pedidoRepository'];
      pedidoRepository.find = jest.fn().mockRejectedValue(new Error('DB error'));
      await expect(service.findByIdVendedor('V1')).rejects.toThrow('DB error');
    });
  });

});
