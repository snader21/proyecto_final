import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductosService } from './productos.service';
import { ProductoEntity } from './entities/producto.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { FileGCP } from './utils/file-gcp.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Multer } from 'multer';
import { PaisEntity } from './entities/pais.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';

describe('ProductosService', () => {
  let service: ProductosService;
  let productoRepository: jest.Mocked<Repository<ProductoEntity>>;
  let categoriaRepository: jest.Mocked<Repository<CategoriaEntity>>;
  let marcaRepository: jest.Mocked<Repository<MarcaEntity>>;
  let unidadMedidaRepository: jest.Mocked<Repository<UnidadMedidaEntity>>;
  let paisRepository: jest.Mocked<Repository<PaisEntity>>;
  let imagenProductoRepository: jest.Mocked<Repository<ImagenProductoEntity>>;
  let archivoProductoRepository: jest.Mocked<Repository<ArchivoProductoEntity>>;
  let fileGcpService: FileGCP;

  const mockFileGCP = {
    save: jest.fn(),
    listFiles: jest.fn(),
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        ProductosService,
        { provide: FileGCP, useValue: mockFileGCP },
        {
          provide: getRepositoryToken(ProductoEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockImplementation((options) => {
              if (options?.relations) {
                return Promise.resolve([{
                  id_producto: '1',
                  nombre: 'Test Product',
                  descripcion: 'Test Description',
                  sku: 'TEST-123',
                  codigo_barras: '123456789',
                  categoria: { id_categoria: '1' },
                  marca: { id_marca: '1' },
                  unidad_medida: { id_unidad_medida: '1' },
                  precio: 100,
                  activo: true,
                  alto: 10,
                  ancho: 10,
                  largo: 10,
                  peso: 1,
                  fecha_creacion: new Date(),
                  fecha_actualizacion: new Date(),
                  id_fabricante: 'FAB-001',
                  pais: { id_pais: '1' }
                }]);
              }
              return Promise.resolve([]);
            }),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(CategoriaEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([new CategoriaEntity()]),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(MarcaEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([{ id_marca: '1', nombre: 'Test Brand', descripcion: 'Test Description' }]),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(UnidadMedidaEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([{ id_unidad_medida: '1', nombre: 'Test Unit', abreviatura: 'TU' }]),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(PaisEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(ImagenProductoEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: getRepositoryToken(ArchivoProductoEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockImplementation((options) => {
              if (options?.order) {
                return Promise.resolve([{
                  id_archivo: '1',
                  nombre_archivo: 'test.csv',
                  estado: 'activo',
                  fecha_carga: new Date(),
                  url: 'http://test.com/test.csv'
                }]);
              }
              return Promise.resolve([]);
            }),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              getOne: jest.fn().mockResolvedValue(null),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    productoRepository = jest.mocked(module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity)));
    categoriaRepository = jest.mocked(module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity)));
    marcaRepository = jest.mocked(module.get<Repository<MarcaEntity>>(getRepositoryToken(MarcaEntity)));
    unidadMedidaRepository = jest.mocked(module.get<Repository<UnidadMedidaEntity>>(getRepositoryToken(UnidadMedidaEntity)));
    paisRepository = jest.mocked(module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity)));
    imagenProductoRepository = jest.mocked(module.get<Repository<ImagenProductoEntity>>(getRepositoryToken(ImagenProductoEntity)));
    archivoProductoRepository = jest.mocked(module.get<Repository<ArchivoProductoEntity>>(getRepositoryToken(ArchivoProductoEntity)));
    fileGcpService = module.get<FileGCP>(FileGCP);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerCategorias', () => {
    it('should return all categories', async () => {
      const expectedCategories = [new CategoriaEntity()];
      jest.spyOn(categoriaRepository, 'find').mockResolvedValueOnce(expectedCategories);

      const result = await service.obtenerCategorias();
      expect(result).toEqual(expectedCategories);
      expect(categoriaRepository.find).toHaveBeenCalled();
    });
  });

  describe('obtenerMarcas', () => {
    it('should return all brands', async () => {
      const expectedBrands = [{ id_marca: '1', nombre: 'Test Brand', descripcion: 'Test Description' }] as MarcaEntity[];
      jest.spyOn(marcaRepository, 'find').mockResolvedValueOnce(expectedBrands);

      const result = await service.obtenerMarcas();
      expect(result).toEqual(expectedBrands);
      expect(marcaRepository.find).toHaveBeenCalled();
    });
  });

  describe('obtenerUnidadesMedida', () => {
    it('should return all measurement units', async () => {
      const expectedUnits = [{ id_unidad_medida: '1', nombre: 'Test Unit', abreviatura: 'TU' }] as UnidadMedidaEntity[];
      jest.spyOn(unidadMedidaRepository, 'find').mockResolvedValueOnce(expectedUnits);

      const result = await service.obtenerUnidadesMedida();
      expect(result).toEqual(expectedUnits);
      expect(unidadMedidaRepository.find).toHaveBeenCalled();
    });
  });

  describe('obtenerProductos', () => {
    it('should return all products', async () => {
      const expectedProducts = [{
        id_producto: '1',
        nombre: 'Test Product',
        descripcion: 'Test Description',
        sku: 'TEST-123',
        codigo_barras: '123456789',
        categoria: { id_categoria: '1' } as CategoriaEntity,
        marca: { id_marca: '1' } as MarcaEntity,
        unidad_medida: { id_unidad_medida: '1' } as UnidadMedidaEntity,
        precio: 100,
        activo: true,
        alto: 10,
        ancho: 10,
        largo: 10,
        peso: 1,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        id_fabricante: 'FAB-001',
        pais: { id_pais: '1' }
      }] as ProductoEntity[];
      jest.spyOn(productoRepository, 'find').mockResolvedValueOnce(expectedProducts);

      const result = await service.obtenerProductos();
      expect(result).toEqual(expectedProducts);
      expect(productoRepository.find).toHaveBeenCalled();
    });
  });

  describe('GuardarProducto', () => {
    it('should save a product with images', async () => {
      // Create related entities
      const mockCategoria = new CategoriaEntity();
      mockCategoria.id_categoria = '550e8400-e29b-41d4-a716-446655440002';
      mockCategoria.nombre = 'Test Category';
      mockCategoria.descripcion = 'Test Description';

      const mockMarca = new MarcaEntity();
      mockMarca.id_marca = '550e8400-e29b-41d4-a716-446655440004';
      mockMarca.nombre = 'Test Brand';
      mockMarca.descripcion = 'Test Description';

      const mockUnidadMedida = new UnidadMedidaEntity();
      mockUnidadMedida.id_unidad_medida = '550e8400-e29b-41d4-a716-446655440006';
      mockUnidadMedida.nombre = 'Test Unit';
      mockUnidadMedida.abreviatura = 'TU';

      const mockPais = new PaisEntity();
      mockPais.id_pais = '550e8400-e29b-41d4-a716-446655440000';
      mockPais.nombre = 'Test Country';
      mockPais.abreviatura = 'TC';
      mockPais.moneda = 'TCU';
      mockPais.iva = 19;

      // Mock save methods for repositories
      jest.spyOn(categoriaRepository, 'save').mockResolvedValueOnce(mockCategoria);
      jest.spyOn(marcaRepository, 'save').mockResolvedValueOnce(mockMarca);
      jest.spyOn(unidadMedidaRepository, 'save').mockResolvedValueOnce(mockUnidadMedida);
      jest.spyOn(paisRepository, 'save').mockResolvedValueOnce(mockPais);

      const mockProduct = {
        nombre: 'Test Product',
        descripcion: 'Test Description',
        sku: 'TEST-123',
        categoria: mockCategoria,
        marca: mockMarca,
        unidad_medida: mockUnidadMedida,
        precio: 100,
        activo: true,
        alto: 10,
        ancho: 10,
        largo: 10,
        peso: 1,
        id_fabricante: 'FAB-001',
        pais: mockPais
      } as ProductoEntity;

      const mockFiles = [{
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 4
      }] as Multer.File[];

      const expectedProduct = { ...mockProduct, id_producto: '1' } as ProductoEntity;

      jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(expectedProduct);
      jest.spyOn(imagenProductoRepository, 'save').mockResolvedValueOnce({
        id_imagen: '1',
        key_object_storage: `imagenes/${expectedProduct.id_producto}/test.jpg`,
        url: 'http://test.com/test.jpg',
        producto: expectedProduct
      } as ImagenProductoEntity);

      mockFileGCP.save.mockResolvedValue('http://test.com/test.jpg');

      const result = await service.GuardarProducto(mockProduct, mockFiles);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('guardarArchivoCSV', () => {
    it('should save a CSV file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from('test'),
        size: 4
      } as Multer.File;
      const expectedUrl = 'http://test.com/test.csv';

      mockFileGCP.save.mockResolvedValue(expectedUrl);
      jest.spyOn(archivoProductoRepository, 'save').mockResolvedValueOnce({
        id_archivo: '1',
        nombre_archivo: mockFile.originalname,
        url: expectedUrl,
        estado: 'pendiente',
        fecha_carga: new Date()
      } as ArchivoProductoEntity);

      const result = await service.guardarArchivoCSV(mockFile);
      expect(result).toEqual({ url: expectedUrl });
    });
  });

  describe('obtenerArchivosCSV', () => {
    it('should return list of CSV files', async () => {
      const expectedFiles = [{
        id_archivo: '1',
        nombre_archivo: 'test.csv',
        estado: 'activo',
        fecha_carga: new Date(),
        url: 'http://test.com/test.csv'
      }];
      jest.spyOn(archivoProductoRepository, 'find').mockResolvedValueOnce(expectedFiles);

      const result = await service.obtenerArchivosCSV();
      expect(result).toEqual(expectedFiles);
    });
  });
});
