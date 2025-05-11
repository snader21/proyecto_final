import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { ProductoEntity } from './entities/producto.entity';
import { ProductoPorPedidoDto } from './dto/producto-por-pedido.dto';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockProductosService = {
    obtenerCategorias: jest.fn(),
    obtenerMarcas: jest.fn(),
    obtenerUnidadesMedida: jest.fn(),
    obtenerArchivosCSV: jest.fn(),
    obtenerProductosPorPedido: jest.fn(),
    obtenerProductos: jest.fn(),
    obtenerProducto: jest.fn(),
    GuardarProducto: jest.fn(),
    actualizarProducto: jest.fn(),
    guardarArchivoCSV: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockProductosService,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('obtenerCategorias', () => {
    it('should return an array of categories', async () => {
      const result: CategoriaEntity[] = [
        { id_categoria: '1', nombre: 'Test Category' } as CategoriaEntity,
      ];
      jest.spyOn(service, 'obtenerCategorias').mockResolvedValue(result);
      expect(await controller.obtenerCategorias()).toBe(result);
    });
  });

  describe('obtenerMarcas', () => {
    it('should return an array of brands', async () => {
      const result: MarcaEntity[] = [
        { id_marca: '1', nombre: 'Test Brand' } as MarcaEntity,
      ];
      jest.spyOn(service, 'obtenerMarcas').mockResolvedValue(result);
      expect(await controller.obtenerMarcas()).toBe(result);
    });
  });

  describe('obtenerUnidadesMedida', () => {
    it('should return an array of measurement units', async () => {
      const result: UnidadMedidaEntity[] = [
        { id_unidad_medida: '1', nombre: 'Test Unit' } as UnidadMedidaEntity,
      ];
      jest.spyOn(service, 'obtenerUnidadesMedida').mockResolvedValue(result);
      expect(await controller.obtenerUnidadesMedida()).toBe(result);
    });
  });

  describe('obtenerArchivosCSV', () => {
    it('should return CSV files', async () => {
      const result = [
        {
          id_archivo: '1',
          nombre_archivo: 'test.csv',
          estado: 'activo',
          fecha_carga: new Date(),
          url: 'http://test.com/test.csv',
          total_registros: 100,
          registros_cargados: 80,
          errores_procesamiento: [
            { row: { data: 'example' }, error: 'Invalid format' },
          ],
          fecha_procesamiento: new Date(),
        },
      ];

      jest.spyOn(service, 'obtenerArchivosCSV').mockResolvedValue(result);
      expect(await controller.obtenerArchivosCSV()).toBe(result);
    });
  });

  describe('obtenerProductosPorPedido', () => {
    it('should return products by order ID', async () => {
      const result: ProductoPorPedidoDto[] = [
        { id_producto: '1', nombre: 'Test Product' } as ProductoPorPedidoDto,
      ];
      jest
        .spyOn(service, 'obtenerProductosPorPedido')
        .mockResolvedValue(result);
      expect(await controller.obtenerProductosPorPedido('test-id')).toBe(
        result,
      );
    });
  });

  describe('obtenerProductos', () => {
    it('should return all products', async () => {
      const result: ProductoEntity[] = [
        { id_producto: '1', nombre: 'Test Product' } as ProductoEntity,
      ];
      jest.spyOn(service, 'obtenerProductos').mockResolvedValue(result);
      expect(await controller.obtenerProductos()).toBe(result);
    });
  });

  describe('guardarProducto', () => {
    it('should save a product with files', async () => {
      const mockProduct = { nombre: 'Test Product' };
      const mockFiles = [{ filename: 'test.jpg' }] as any[];
      const result = { id_producto: '1', ...mockProduct } as ProductoEntity;

      jest.spyOn(service, 'GuardarProducto').mockResolvedValue(result);
      expect(
        await controller.guardarProducto(
          JSON.stringify(mockProduct),
          mockFiles,
        ),
      ).toBe(result);
    });
  });

  describe('uploadCSV', () => {
    it('should upload a CSV file', async () => {
      const mockFile = { filename: 'test.csv', mimetype: 'text/csv' } as any;
      const result = { url: 'http://test.com/test.csv' };

      jest.spyOn(service, 'guardarArchivoCSV').mockResolvedValue(result);
      expect(await controller.uploadCSV([mockFile])).toBe(result);
    });

    it('should reject non-CSV files', async () => {
      const mockFile = { filename: 'test.jpg', mimetype: 'image/jpeg' } as any;
      await expect(controller.uploadCSV([mockFile])).rejects.toThrow('Solo se permiten archivos CSV');
    });

    it('should handle empty file array', async () => {
      await expect(controller.uploadCSV([])).rejects.toThrow('No se ha proporcionado ningún archivo');
    });
  });

  describe('obtenerProducto', () => {
    it('should return a product by ID', async () => {
      const mockProduct = {
        id_producto: 'PROD-1',
        nombre: 'Test Product',
        descripcion: 'Test Description',
      } as ProductoEntity;

      jest.spyOn(service, 'obtenerProducto').mockResolvedValue(mockProduct);
      expect(await controller.obtenerProducto('PROD-1')).toBe(mockProduct);
      expect(service.obtenerProducto).toHaveBeenCalledWith('PROD-1');
    });

    it('should handle non-existent product', async () => {
      jest.spyOn(service, 'obtenerProducto').mockRejectedValue(new Error('Producto no encontrado'));
      await expect(controller.obtenerProducto('NON-EXISTENT')).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('actualizarProducto', () => {
    it('should update a product with files', async () => {
      const mockProduct = {
        nombre: 'Updated Product',
        descripcion: 'Updated Description',
      };
      const mockFiles = [{ filename: 'new-image.jpg' }] as any[];
      const result = { id_producto: 'PROD-1', ...mockProduct } as ProductoEntity;

      jest.spyOn(service, 'actualizarProducto').mockResolvedValue(result);
      expect(
        await controller.actualizarProducto(
          'PROD-1',
          JSON.stringify(mockProduct),
          mockFiles,
        ),
      ).toBe(result);
      expect(service.actualizarProducto).toHaveBeenCalledWith(
        'PROD-1',
        mockProduct,
        mockFiles,
      );
    });

    it('should update a product without files', async () => {
      const mockProduct = {
        nombre: 'Updated Product',
        descripcion: 'Updated Description',
      };
      const result = { id_producto: 'PROD-1', ...mockProduct } as ProductoEntity;

      jest.spyOn(service, 'actualizarProducto').mockResolvedValue(result);
      expect(
        await controller.actualizarProducto(
          'PROD-1',
          JSON.stringify(mockProduct),
          [],
        ),
      ).toBe(result);
      expect(service.actualizarProducto).toHaveBeenCalledWith(
        'PROD-1',
        mockProduct,
        [],
      );
    });

    it('should handle invalid JSON data', async () => {
      const invalidJson = '{invalid:json';
      await expect(
        controller.actualizarProducto('PROD-1', invalidJson, []),
      ).rejects.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle service errors gracefully', async () => {
      jest.spyOn(service, 'obtenerProductos').mockRejectedValue(new Error('Database error'));
      await expect(controller.obtenerProductos()).rejects.toThrow('Database error');
    });

    it('should handle empty product data', async () => {
      await expect(
        controller.guardarProducto('', []),
      ).rejects.toThrow('No se han proporcionado datos del producto');
    });
  });
});
