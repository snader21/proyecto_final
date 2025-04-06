import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventariosService } from './inventarios.service';
import { InventarioEntity } from './entities/inventario.entity';
import { TipoMovimientoEnum } from '../movimientos-inventario/enums/tipo-movimiento.enum';
import { BadRequestException } from '@nestjs/common';

describe('InventariosService', () => {
  let service: InventariosService;
  let repositorio: jest.Mocked<Repository<InventarioEntity>>;

  beforeEach(async () => {
    repositorio = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventariosService,
        {
          provide: getRepositoryToken(InventarioEntity),
          useValue: repositorio,
        },
      ],
    }).compile();

    service = module.get<InventariosService>(InventariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerInventarioDeProducto', () => {
    it('should return inventory for product and location', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);

      const result = await service.obtenerInventarioDeProducto('PROD-1', 'UBI-1');

      expect(result).toEqual(mockInventario);
      expect(repositorio.findOne).toHaveBeenCalledWith({
        where: {
          producto: { id_producto: 'PROD-1' },
          ubicacion: { id_ubicacion: 'UBI-1' },
        },
      });
    });

    it('should return null when inventory not found', async () => {
      repositorio.findOne.mockResolvedValue(null);

      const result = await service.obtenerInventarioDeProducto('PROD-1', 'UBI-1');

      expect(result).toBeNull();
    });
  });

  describe('actualizarInventarioDeProducto', () => {
    const mockManager = {
      save: jest.fn(),
    } as any;

    const mockUbicacion = {
      id_ubicacion: 'UBI-1',
    } as any;

    it('should create new inventory when not exists', async () => {
      const mockNewInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 0,
        cantidad_minima: 0,
        cantidad_maxima: 1000,
        fecha_actualizacion: expect.any(Date),
      };

      repositorio.findOne.mockResolvedValue(null);
      mockManager.save.mockResolvedValue(mockNewInventario);

      const result = await service.actualizarInventarioDeProducto(
        'PROD-1',
        TipoMovimientoEnum.ENTRADA,
        mockUbicacion,
        10,
        mockManager,
      );

      expect(result).toEqual(mockNewInventario);
      expect(mockManager.save).toHaveBeenCalledWith(
        InventarioEntity,
        expect.objectContaining({
          producto: { id_producto: 'PROD-1' },
          ubicacion: { id_ubicacion: 'UBI-1' },
          cantidad_disponible: 0,
          cantidad_minima: 0,
          cantidad_maxima: 1000,
        }),
      );
    });

    it('should update inventory for ENTRADA movement', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);
      mockManager.save.mockImplementation((_, inventory) => inventory);

      const result = await service.actualizarInventarioDeProducto(
        'PROD-1',
        TipoMovimientoEnum.ENTRADA,
        mockUbicacion,
        5,
        mockManager,
      );

      expect(result.cantidad_disponible).toBe(15);
      expect(mockManager.save).toHaveBeenCalledWith(InventarioEntity, expect.any(Object));
    });

    it('should update inventory for SALIDA movement', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);
      mockManager.save.mockImplementation((_, inventory) => inventory);

      const result = await service.actualizarInventarioDeProducto(
        'PROD-1',
        TipoMovimientoEnum.SALIDA,
        mockUbicacion,
        5,
        mockManager,
      );

      expect(result.cantidad_disponible).toBe(5);
      expect(mockManager.save).toHaveBeenCalledWith(InventarioEntity, expect.any(Object));
    });

    it('should throw error when insufficient stock for SALIDA', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);

      await expect(
        service.actualizarInventarioDeProducto(
          'PROD-1',
          TipoMovimientoEnum.SALIDA,
          mockUbicacion,
          15,
          mockManager,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
