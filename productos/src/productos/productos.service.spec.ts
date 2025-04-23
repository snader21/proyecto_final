import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProductosService } from './productos.service';
import { ProductoEntity } from './entities/producto.entity';
import { MovimientoInventarioEntity } from '../movimientos-inventario/entities/movimiento-inventario.entity';
import { PaisEntity } from './entities/pais.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { FileGCP } from './utils/file-gcp.service';
import { PubSubService } from '../common/services/pubsub.service';
import { NotFoundException } from '@nestjs/common';
import { UploadedFile } from './interfaces/uploaded-file.interface';
import { TipoMovimientoEnum } from '../movimientos-inventario/enums/tipo-movimiento.enum';

describe('ProductosService', () => {
  let service: ProductosService;
  let mockProductoRepository: jest.Mocked<Repository<ProductoEntity>>;
  let mockMovimientoInventarioRepository: jest.Mocked<
    Repository<MovimientoInventarioEntity>
  >;
  let mockPaisRepository: jest.Mocked<Repository<PaisEntity>>;
  let mockCategoriaRepository: jest.Mocked<Repository<CategoriaEntity>>;
  let mockMarcaRepository: jest.Mocked<Repository<MarcaEntity>>;
  let mockUnidadMedidaRepository: jest.Mocked<Repository<UnidadMedidaEntity>>;
  let mockBodegaRepository: jest.Mocked<Repository<BodegaEntity>>;
  let mockUbicacionRepository: jest.Mocked<Repository<UbicacionEntity>>;
  let mockImagenProductoRepository: jest.Mocked<
    Repository<ImagenProductoEntity>
  >;
  let mockArchivoProductoRepository: jest.Mocked<
    Repository<ArchivoProductoEntity>
  >;
  let mockFileGCP: jest.Mocked<FileGCP>;
  let mockPubSubService: jest.Mocked<PubSubService>;
  let mockQueryBuilder: jest.Mocked<
    SelectQueryBuilder<MovimientoInventarioEntity>
  >;

  const mockCategoriaPadre = {
    id_categoria: 'CAT-0',
    nombre: 'Parent Category',
    descripcion: 'Parent Description',
    categoria_padre: null,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  } as unknown as CategoriaEntity;

  const mockCategoria = {
    id_categoria: 'CAT-1',
    nombre: 'Category 1',
    descripcion: 'Description 1',
    categoria_padre: mockCategoriaPadre,
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  } as unknown as CategoriaEntity;

  const mockBodega = {
    id_bodega: 'BOD-1',
    nombre: 'Test Warehouse',
    descripcion: 'Test Description',
    direccion: 'Test Address',
    capacidad: 1000,
    ubicaciones: [],
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  } as BodegaEntity;

  const mockUbicacion = {
    id_ubicacion: 'UBI-1',
    nombre: 'Test Location',
    descripcion: 'Test Description',
    tipo: 'ALMACEN',
    bodega: mockBodega,
    movimientos_inventario: [],
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  } as UbicacionEntity;

  const mockProducto = {
    id_producto: 'PROD-1',
    nombre: 'Test Product',
    descripcion: 'Test Description',
    sku: 'TEST-123',
    codigo_barras: '123456789',
    precio: 100,
    activo: true,
    alto: 10,
    ancho: 10,
    largo: 10,
    peso: 1,
    id_fabricante: 'FAB-123',
    categoria: mockCategoria,
    marca: {
      id_marca: 'MAR-123',
      nombre: 'Test Brand',
      descripcion: 'Test Brand Description',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    } as MarcaEntity,
    unidad_medida: {
      id_unidad_medida: 'UM-123',
      nombre: 'Test Unit',
      abreviatura: 'TU',
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    } as UnidadMedidaEntity,
    pais: {
      id_pais: 'PAIS-123',
      nombre: 'Test Country',
      abreviatura: 'TC',
      moneda: 'USD',
      iva: 19,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    } as PaisEntity,
    inventario: [],
    imagenes: [],
    movimientos_inventario: [],
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  } as ProductoEntity;

  beforeEach(async () => {
    mockQueryBuilder = {
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    } as any;

    mockProductoRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    } as any;

    mockMovimientoInventarioRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    } as any;

    mockPaisRepository = {
      save: jest.fn(),
    } as any;

    mockCategoriaRepository = {
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    mockMarcaRepository = {
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    mockUnidadMedidaRepository = {
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    mockBodegaRepository = {
      save: jest.fn(),
    } as any;

    mockUbicacionRepository = {
      save: jest.fn(),
    } as any;

    mockImagenProductoRepository = {
      save: jest.fn(),
    } as any;

    mockArchivoProductoRepository = {
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    mockFileGCP = {
      save: jest.fn(),
    } as any;

    mockPubSubService = {
      publishMessage: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(ProductoEntity),
          useValue: mockProductoRepository,
        },
        {
          provide: getRepositoryToken(MovimientoInventarioEntity),
          useValue: mockMovimientoInventarioRepository,
        },
        {
          provide: getRepositoryToken(PaisEntity),
          useValue: mockPaisRepository,
        },
        {
          provide: getRepositoryToken(CategoriaEntity),
          useValue: mockCategoriaRepository,
        },
        {
          provide: getRepositoryToken(MarcaEntity),
          useValue: mockMarcaRepository,
        },
        {
          provide: getRepositoryToken(UnidadMedidaEntity),
          useValue: mockUnidadMedidaRepository,
        },
        {
          provide: getRepositoryToken(BodegaEntity),
          useValue: mockBodegaRepository,
        },
        {
          provide: getRepositoryToken(UbicacionEntity),
          useValue: mockUbicacionRepository,
        },
        {
          provide: getRepositoryToken(ImagenProductoEntity),
          useValue: mockImagenProductoRepository,
        },
        {
          provide: getRepositoryToken(ArchivoProductoEntity),
          useValue: mockArchivoProductoRepository,
        },
        {
          provide: FileGCP,
          useValue: mockFileGCP,
        },
        {
          provide: PubSubService,
          useValue: mockPubSubService,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerProductosPorPedido', () => {
    it('should return empty array when no products found', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.obtenerProductosPorPedido('ORDER-1');

      expect(result).toEqual([]);
    });
  });

  describe('obtenerCategorias', () => {
    it('should return all categories', async () => {
      const mockCategorias = [mockCategoria];

      mockCategoriaRepository.find.mockResolvedValue(mockCategorias);

      const result = await service.obtenerCategorias();

      expect(result).toEqual(mockCategorias);
      expect(mockCategoriaRepository.find).toHaveBeenCalled();
    });
  });

  describe('obtenerMarcas', () => {
    it('should return all brands', async () => {
      const mockMarcas: MarcaEntity[] = [
        {
          id_marca: 'MARCA-1',
          nombre: 'Brand 1',
          descripcion: 'Description 1',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
        } as MarcaEntity,
        {
          id_marca: 'MARCA-2',
          nombre: 'Brand 2',
          descripcion: 'Description 2',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
        } as MarcaEntity,
      ];

      mockMarcaRepository.find.mockResolvedValue(mockMarcas);

      const result = await service.obtenerMarcas();

      expect(result).toEqual(mockMarcas);
      expect(mockMarcaRepository.find).toHaveBeenCalled();
    });
  });

  describe('obtenerUnidadesMedida', () => {
    it('should return all measurement units', async () => {
      const mockUnidades: UnidadMedidaEntity[] = [
        {
          id_unidad_medida: 'UM-1',
          nombre: 'Unit 1',
          abreviatura: 'U1',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
        } as UnidadMedidaEntity,
        {
          id_unidad_medida: 'UM-2',
          nombre: 'Unit 2',
          abreviatura: 'U2',
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
        } as UnidadMedidaEntity,
      ];

      mockUnidadMedidaRepository.find.mockResolvedValue(mockUnidades);

      const result = await service.obtenerUnidadesMedida();

      expect(result).toEqual(mockUnidades);
      expect(mockUnidadMedidaRepository.find).toHaveBeenCalled();
    });
  });

  describe('GuardarProducto', () => {
    it('should save product without files', async () => {
      mockProductoRepository.save.mockResolvedValue(mockProducto);

      const result = await service.GuardarProducto(mockProducto, []);

      expect(result).toEqual(mockProducto);
      expect(mockProductoRepository.save).toHaveBeenCalledWith(mockProducto);
      expect(mockFileGCP.save).not.toHaveBeenCalled();
      expect(mockImagenProductoRepository.save).not.toHaveBeenCalled();
    });

    it('should save product with files', async () => {
      const mockFiles: UploadedFile[] = [
        {
          fieldname: 'file',
          originalname: 'test.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
          size: 4,
        },
      ];

      mockProductoRepository.save.mockResolvedValue(mockProducto);
      mockFileGCP.save.mockResolvedValue(
        'https://storage.googleapis.com/test-bucket/test.jpg',
      );

      const result = await service.GuardarProducto(mockProducto, mockFiles);

      expect(result).toEqual(mockProducto);
      expect(mockProductoRepository.save).toHaveBeenCalledWith(mockProducto);
      expect(mockFileGCP.save).toHaveBeenCalledWith(
        mockFiles[0],
        `imagenes/${mockProducto.id_producto}/${mockFiles[0].originalname}`,
      );
      expect(mockImagenProductoRepository.save).toHaveBeenCalledWith({
        key_object_storage: `imagenes/${mockProducto.id_producto}/${mockFiles[0].originalname}`,
        url: 'https://storage.googleapis.com/test-bucket/test.jpg',
        producto: mockProducto,
      });
    });
  });

  describe('guardarArchivoCSV', () => {
    it('should save CSV file and publish message', async () => {
      const mockFile: UploadedFile = {
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from('test'),
        size: 4,
      };

      const mockUrl = 'https://storage.googleapis.com/test-bucket/test.csv';
      const mockArchivoProducto: ArchivoProductoEntity = {
        id_archivo: 'ARCH-1',
        nombre_archivo: 'test.csv',
        url: mockUrl,
        estado: 'pendiente',
        total_registros: 0,
        registros_cargados: 0,
        errores_procesamiento: [],
        fecha_carga: new Date(),
        fecha_procesamiento: new Date(),
      } as ArchivoProductoEntity;

      mockFileGCP.save.mockResolvedValue(mockUrl);
      mockArchivoProductoRepository.save.mockResolvedValue(mockArchivoProducto);

      const result = await service.guardarArchivoCSV(mockFile);

      expect(result).toEqual({ url: mockUrl });
      expect(mockFileGCP.save).toHaveBeenCalledWith(
        mockFile,
        expect.stringContaining('csvs/'),
      );
      expect(mockArchivoProductoRepository.save).toHaveBeenCalledWith({
        nombre_archivo: mockFile.originalname,
        url: mockUrl,
        estado: 'pendiente',
      });
      expect(mockPubSubService.publishMessage).toHaveBeenCalledWith({
        archivoProductoId: mockArchivoProducto.id_archivo,
      });
    });
  });

  describe('obtenerArchivosCSV', () => {
    it('should return all CSV files ordered by upload date', async () => {
      const mockArchivos: ArchivoProductoEntity[] = [
        {
          id_archivo: 'ARCH-1',
          nombre_archivo: 'test1.csv',
          url: 'https://example.com/test1.csv',
          estado: 'procesado',
          total_registros: 10,
          registros_cargados: 10,
          errores_procesamiento: [],
          fecha_carga: new Date('2025-01-01'),
          fecha_procesamiento: new Date('2025-01-01'),
        } as ArchivoProductoEntity,
        {
          id_archivo: 'ARCH-2',
          nombre_archivo: 'test2.csv',
          url: 'https://example.com/test2.csv',
          estado: 'pendiente',
          total_registros: 0,
          registros_cargados: 0,
          errores_procesamiento: [],
          fecha_carga: new Date('2025-01-02'),
          fecha_procesamiento: new Date('2025-01-02'),
        } as ArchivoProductoEntity,
      ];

      mockArchivoProductoRepository.find.mockResolvedValue(mockArchivos);

      const result = await service.obtenerArchivosCSV();

      expect(result).toEqual(mockArchivos);
      expect(mockArchivoProductoRepository.find).toHaveBeenCalledWith({
        order: {
          fecha_carga: 'DESC',
        },
      });
    });
  });

  describe('obtenerProducto', () => {
    it('should return product by id', async () => {
      mockProductoRepository.findOne.mockResolvedValue(mockProducto);

      const result = await service.obtenerProducto('PROD-1');

      expect(result).toEqual(mockProducto);
      expect(mockProductoRepository.findOne).toHaveBeenCalledWith({
        where: { id_producto: 'PROD-1' },
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductoRepository.findOne.mockResolvedValue(null);

      await expect(service.obtenerProducto('PROD-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductoRepository.findOne).toHaveBeenCalledWith({
        where: { id_producto: 'PROD-1' },
      });
    });
  });

  describe('obtenerProductos', () => {
    it('should return all products with relations', async () => {
      const mockProductos = [mockProducto];

      mockProductoRepository.find.mockResolvedValue(mockProductos);

      const result = await service.obtenerProductos();

      expect(result).toEqual(mockProductos);
      expect(mockProductoRepository.find).toHaveBeenCalledWith({
        relations: {
          categoria: true,
          unidad_medida: true,
          marca: true,
          imagenes: true,
        },
        select: expect.any(Object),
      });
    });
  });
});
