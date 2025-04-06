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
    GuardarProducto: jest.fn(),
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
      const mockFile = { filename: 'test.csv' } as any;
      const result = { url: 'http://test.com/test.csv' };

      jest.spyOn(service, 'guardarArchivoCSV').mockResolvedValue(result);
      expect(await controller.uploadCSV([mockFile])).toBe(result);
    });
  });
});
