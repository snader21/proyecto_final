import { Test, TestingModule } from '@nestjs/testing';
import { ProductoFileProcessorService } from './producto-file-processor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from '../entities/producto.entity';
import { ArchivoProductoEntity } from '../entities/archivo-producto.entity';
import { FileGCP } from '../utils/file-gcp.service';
import { ProductoValidator } from '../validations/producto-validator.interface';

describe('ProductoFileProcessorService', () => {
  let service: ProductoFileProcessorService;
  let productoRepository: any;
  let archivoProductoRepository: any;
  let fileGCP: any;
  let validators: ProductoValidator[];

  const mockProductoData = {
    nombre: 'Test Product',
    descripcion: 'Test Description',
    sku: 'TEST-SKU',
    codigo_barras: '123456789',
    categoria: { id_categoria: '1' },
    marca: { id_marca: '1' },
    unidad_medida: { id_unidad_medida: '1' },
    precio: 100,
    alto: 10,
    ancho: 10,
    largo: 10,
    peso: 1,
    pais: { id_pais: '1' },
  };

  const mockArchivoProducto = {
    id_archivo: 'test-id',
    nombre_archivo: 'test.csv',
    url: '/test.csv',
    estado: 'pendiente',
  };

  const mockUpdateResult = {
    affected: 1,
    raw: {},
  };

  const mockCSVContent = Buffer.from(
    'nombre,descripcion,sku,codigo_barras,categoriaId,marcaId,unidadMedidaId,precio,alto,ancho,largo,peso,paisId\n' +
    'Test Product,Test Description,TEST-SKU,123456789,1,1,1,100,10,10,10,1,1',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoFileProcessorService,
        {
          provide: getRepositoryToken(ProductoEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ArchivoProductoEntity),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: FileGCP,
          useValue: {
            getFile: jest.fn(),
          },
        },
        {
          provide: 'PRODUCTO_VALIDATORS',
          useValue: [
            {
              validate: jest.fn().mockResolvedValue({ isValid: true }),
            },
          ],
        },
      ],
    }).compile();

    service = module.get<ProductoFileProcessorService>(ProductoFileProcessorService);
    productoRepository = module.get(getRepositoryToken(ProductoEntity));
    archivoProductoRepository = module.get(getRepositoryToken(ArchivoProductoEntity));
    fileGCP = module.get(FileGCP);
    validators = module.get('PRODUCTO_VALIDATORS');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFile', () => {
    it('should process a valid CSV file successfully', async () => {
      // Mock repository responses
      jest.spyOn(archivoProductoRepository, 'findOne')
        .mockResolvedValue(mockArchivoProducto);

      jest.spyOn(fileGCP, 'getFile')
        .mockResolvedValue(mockCSVContent);

      jest.spyOn(productoRepository, 'create')
        .mockReturnValue(mockProductoData);

      jest.spyOn(productoRepository, 'save')
        .mockResolvedValue(mockProductoData);

      jest.spyOn(archivoProductoRepository, 'update')
        .mockResolvedValue(mockUpdateResult);

      await service.processFile('test-id');

      // Verify repository calls
      expect(archivoProductoRepository.findOne).toHaveBeenCalledWith({
        where: { id_archivo: 'test-id' },
      });

      expect(fileGCP.getFile).toHaveBeenCalledWith('/test.csv');

      expect(productoRepository.create).toHaveBeenCalled();
      expect(productoRepository.save).toHaveBeenCalled();

      expect(archivoProductoRepository.update).toHaveBeenCalledWith(
        'test-id',
        expect.objectContaining({
          estado: 'procesado',
          total_registros: 1,
          registros_cargados: 1,
        }),
      );
    });

    it('should handle partial success with some failed rows', async () => {
      const mockCSVWithMultipleRows = Buffer.from(
        `${mockCSVContent.toString()}\nINVALID-SKU,Invalid Product,Description,123,1,1,1,100,10,10,10,1,1`,
      );
      
      jest.spyOn(archivoProductoRepository, 'findOne')
        .mockResolvedValue(mockArchivoProducto);

      jest.spyOn(fileGCP, 'getFile')
        .mockResolvedValue(mockCSVWithMultipleRows);

      jest.spyOn(productoRepository, 'create')
        .mockReturnValue(mockProductoData);

      jest.spyOn(productoRepository, 'save')
        .mockResolvedValueOnce(mockProductoData)
        .mockRejectedValueOnce(new Error('Invalid SKU'));

      jest.spyOn(archivoProductoRepository, 'update')
        .mockResolvedValue(mockUpdateResult);

      await service.processFile('test-id');

      expect(archivoProductoRepository.update).toHaveBeenCalledWith(
        'test-id',
        expect.objectContaining({
          estado: 'parcial',
          total_registros: 2,
          registros_cargados: 1,
        }),
      );
    });
  });
});
