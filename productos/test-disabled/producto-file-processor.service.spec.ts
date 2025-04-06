import { Test, TestingModule } from '@nestjs/testing';
import { ProductoFileProcessorService } from './producto-file-processor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ProductoEntity } from '../entities/producto.entity';
import { ArchivoProductoEntity } from '../entities/archivo-producto.entity';
import { FileGCP } from '../utils/file-gcp.service';
import { ProductoValidator } from '../validations/producto-validator.interface';

describe('ProductoFileProcessorService', () => {
  let service: ProductoFileProcessorService;
  let mockProductoRepository: jest.Mocked<Repository<ProductoEntity>>;
  let mockArchivoProductoRepository: jest.Mocked<Repository<ArchivoProductoEntity>>;
  let mockFileGCP: jest.Mocked<FileGCP>;
  let mockValidator1: jest.Mocked<ProductoValidator>;
  let mockValidator2: jest.Mocked<ProductoValidator>;

  const baseProductoRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const baseArchivoProductoRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const baseFileGCP = {
    getFile: jest.fn(),
  };

  beforeEach(async () => {
    mockValidator1 = {
      validate: jest.fn().mockResolvedValue({ isValid: true }),
    } as unknown as jest.Mocked<ProductoValidator>;

    mockValidator2 = {
      validate: jest.fn().mockResolvedValue({ isValid: true }),
    } as unknown as jest.Mocked<ProductoValidator>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoFileProcessorService,
        {
          provide: getRepositoryToken(ProductoEntity),
          useValue: baseProductoRepository,
        },
        {
          provide: getRepositoryToken(ArchivoProductoEntity),
          useValue: baseArchivoProductoRepository,
        },
        {
          provide: FileGCP,
          useValue: baseFileGCP,
        },
        {
          provide: 'PRODUCTO_VALIDATORS',
          useValue: [mockValidator1, mockValidator2],
        },
      ],
    }).compile();

    service = module.get<ProductoFileProcessorService>(ProductoFileProcessorService);
    mockProductoRepository = module.get(getRepositoryToken(ProductoEntity));
    mockArchivoProductoRepository = module.get(getRepositoryToken(ArchivoProductoEntity));
    mockFileGCP = module.get(FileGCP);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFile', () => {
    const mockArchivoProducto: ArchivoProductoEntity = {
      id_archivo: 'test-id',
      nombre_archivo: 'test.csv',
      url: 'https://storage.googleapis.com/bucket/folder/test.csv',
      estado: 'pendiente',
      total_registros: 0,
      registros_cargados: 0,
      errores_procesamiento: [],
      fecha_carga: new Date(),
      fecha_procesamiento: new Date(),
    };

    const mockCSVContent = `nombre,descripcion,sku,codigo_barras,categoriaId,marcaId,unidadMedidaId,precio,alto,ancho,largo,peso,paisId,id_fabricante
Producto1,Desc1,SKU1,123,cat1,marca1,um1,100,10,10,10,1,pais1,fab1
Producto2,Desc2,SKU2,456,cat2,marca2,um2,200,20,20,20,2,pais2,fab2`;

    beforeEach(() => {
      mockArchivoProductoRepository.findOne.mockResolvedValue(mockArchivoProducto);
      mockFileGCP.getFile.mockResolvedValue(Buffer.from(mockCSVContent));
      mockProductoRepository.create.mockImplementation((data: Partial<ProductoEntity>) => data as ProductoEntity);
      mockProductoRepository.save.mockImplementation((data: ProductoEntity) => Promise.resolve(data));
      mockArchivoProductoRepository.update.mockImplementation((id, data) => {
        const result: UpdateResult = {
          affected: 1,
          raw: [],
          generatedMaps: [],
        };
        return Promise.resolve(result);
      });
    });

    it('should process CSV file successfully', async () => {
      await service.processFile('test-id');

      expect(mockArchivoProductoRepository.findOne).toHaveBeenCalledWith({ where: { id_archivo: 'test-id' } });
      expect(mockFileGCP.getFile).toHaveBeenCalledTimes(1);
      expect(mockProductoRepository.save).toHaveBeenCalledTimes(2);
      expect(mockArchivoProductoRepository.update).toHaveBeenCalledWith('test-id', expect.objectContaining({
        estado: 'procesado',
        total_registros: 2,
        registros_cargados: 2,
      }));
    });

    it('should handle validation failures', async () => {
      (mockValidator1.validate as jest.Mock).mockResolvedValueOnce({ isValid: false, message: 'Validation failed' });

      await service.processFile('test-id');

      expect(mockProductoRepository.save).toHaveBeenCalledTimes(1);
      expect(mockArchivoProductoRepository.update).toHaveBeenCalledWith('test-id', expect.objectContaining({
        estado: 'parcial',
        total_registros: 2,
        registros_cargados: 1,
      }));
    });

    it('should handle file not found', async () => {
      mockArchivoProductoRepository.findOne.mockResolvedValue(null);

      await service.processFile('test-id');

      expect(mockFileGCP.getFile).not.toHaveBeenCalled();
      expect(mockProductoRepository.save).not.toHaveBeenCalled();
      expect(mockArchivoProductoRepository.update).not.toHaveBeenCalled();
    });

    it('should handle already processed files', async () => {
      const processedFile: ArchivoProductoEntity = {
        ...mockArchivoProducto,
        estado: 'procesado',
        fecha_procesamiento: new Date(),
      };

      mockArchivoProductoRepository.findOne.mockResolvedValue(processedFile);

      await service.processFile('test-id');

      expect(mockFileGCP.getFile).not.toHaveBeenCalled();
      expect(mockProductoRepository.save).not.toHaveBeenCalled();
      expect(mockArchivoProductoRepository.update).not.toHaveBeenCalled();
    });

    it('should handle file processing errors', async () => {
      mockFileGCP.getFile.mockRejectedValue(new Error('File read error'));

      await expect(service.processFile('test-id')).rejects.toThrow('File read error');

      expect(mockArchivoProductoRepository.update).toHaveBeenCalledWith('test-id', expect.objectContaining({
        estado: 'error',
        errores_procesamiento: [{ error: 'File read error' }],
      }));
    });
  });

  describe('parseCSV', () => {
    it('should parse CSV content correctly', async () => {
      const csvContent = 'name,value\ntest1,1\ntest2,2';
      const result = await service['parseCSV'](csvContent);

      expect(result).toEqual([
        { name: 'test1', value: '1' },
        { name: 'test2', value: '2' },
      ]);
    });

    it('should handle CSV parsing errors', async () => {
      const invalidCSV = 'name,value\ntest1,1,extra\ntest2,2';

      await expect(service['parseCSV'](invalidCSV)).rejects.toThrow();
    });
  });
});
