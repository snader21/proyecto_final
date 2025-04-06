import { Test, TestingModule } from '@nestjs/testing';
import { ProductosFileModule } from './productos-file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { PaisEntity } from './entities/pais.entity';
import { PubSubService } from '../common/services/pubsub.service';
import { ProductoFileProcessorService } from './services/producto-file-processor.service';
import { FileGCP } from './utils/file-gcp.service';
import { MarcaValidator } from './validations/validators/marca.validator';
import { CategoriaValidator } from './validations/validators/categoria.validator';
import { UnidadMedidaValidator } from './validations/validators/unidad-medida.validator';
import { PaisValidator } from './validations/validators/pais.validator';
import { SkuValidator } from './validations/validators/sku.validator';
import { ProductoValidator } from './validations/producto-validator.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

jest.mock('../common/services/pubsub.service');
jest.mock('./services/producto-file-processor.service');

describe('ProductosFileModule', () => {
  let module: TestingModule;
  let pubSubService: jest.Mocked<PubSubService>;
  let fileProcessor: jest.Mocked<ProductoFileProcessorService>;

  beforeEach(async () => {
    const mockPubSubService = {
      subscribe: jest.fn(),
    };

    const mockFileProcessor = {
      processFile: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'GCP_PROJECT_ID':
            return 'test-project';
          case 'GCP_CLIENT_EMAIL':
            return 'test@example.com';
          case 'GCP_PRIVATE_KEY':
            return 'test-key';
          case 'GCP_BUCKET_NAME':
            return 'test-bucket';
          default:
            return '';
        }
      }),
    };

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            ProductoEntity,
            ArchivoProductoEntity,
            CategoriaEntity,
            MarcaEntity,
            UnidadMedidaEntity,
            PaisEntity,
          ],
          synchronize: true,
        }),
        ProductosFileModule,
      ],
      providers: [
        {
          provide: PubSubService,
          useValue: mockPubSubService,
        },
        {
          provide: ProductoFileProcessorService,
          useValue: mockFileProcessor,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    pubSubService = module.get<PubSubService>(PubSubService) as jest.Mocked<PubSubService>;
    fileProcessor = module.get<ProductoFileProcessorService>(
      ProductoFileProcessorService,
    ) as jest.Mocked<ProductoFileProcessorService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should subscribe to file processing messages', async () => {
      await module.init();
      expect(pubSubService.subscribe).toHaveBeenCalled();
    });

    it('should process files when receiving messages', async () => {
      await module.init();
      const subscribeCallback = (pubSubService.subscribe as jest.Mock).mock.calls[0][0] as (
        message: { archivoProductoId: string; }
      ) => Promise<void>;

      await subscribeCallback({ archivoProductoId: 'test-id' });

      expect(fileProcessor.processFile).toHaveBeenCalledWith('test-id');
    });

    it('should handle processing errors gracefully', async () => {
      await module.init();
      const subscribeCallback = (pubSubService.subscribe as jest.Mock).mock.calls[0][0] as (
        message: { archivoProductoId: string; }
      ) => Promise<void>;

      (fileProcessor.processFile as jest.Mock).mockRejectedValueOnce(
        new Error('Processing failed'),
      );

      await subscribeCallback({ archivoProductoId: 'test-id' });

      expect(fileProcessor.processFile).toHaveBeenCalledWith('test-id');
    });
  });

  describe('Validator Factory', () => {
    it('should provide all validators', () => {
      const validators = module.get<ProductoValidator[]>('PRODUCTO_VALIDATORS');
      expect(validators).toBeDefined();
      expect(validators.length).toBe(5);

      const validatorTypes = validators.map((v: ProductoValidator) => 
        v.constructor.name,
      );
      expect(validatorTypes).toContain('SkuValidator');
      expect(validatorTypes).toContain('MarcaValidator');
      expect(validatorTypes).toContain('CategoriaValidator');
      expect(validatorTypes).toContain('UnidadMedidaValidator');
      expect(validatorTypes).toContain('PaisValidator');
    });
  });

  describe('Module Dependencies', () => {
    it('should provide FileGCP service', () => {
      const fileGCP = module.get<FileGCP>(FileGCP);
      expect(fileGCP).toBeDefined();
    });

    it('should provide ProductoFileProcessorService', () => {
      expect(fileProcessor).toBeDefined();
    });

    it('should provide all required validators', () => {
      const skuValidator = module.get<SkuValidator>(SkuValidator);
      const marcaValidator = module.get<MarcaValidator>(MarcaValidator);
      const categoriaValidator = module.get<CategoriaValidator>(CategoriaValidator);
      const unidadMedidaValidator = module.get<UnidadMedidaValidator>(
        UnidadMedidaValidator,
      );
      const paisValidator = module.get<PaisValidator>(PaisValidator);

      expect(skuValidator).toBeDefined();
      expect(marcaValidator).toBeDefined();
      expect(categoriaValidator).toBeDefined();
      expect(unidadMedidaValidator).toBeDefined();
      expect(paisValidator).toBeDefined();
    });
  });
});
