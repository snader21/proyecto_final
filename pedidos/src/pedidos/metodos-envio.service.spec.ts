import { Test, TestingModule } from '@nestjs/testing';
import { MetodosEnvioService } from './metodos-envio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { Repository } from 'typeorm';

describe('MetodosEnvioService', () => {
  let service: MetodosEnvioService;
  let metodoEnvioRepository: jest.Mocked<Repository<MetodoEnvioEntity>>;

  beforeEach(async () => {
    metodoEnvioRepository = {
      find: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetodosEnvioService,
        {
          provide: getRepositoryToken(MetodoEnvioEntity),
          useValue: metodoEnvioRepository,
        },
      ],
    }).compile();

    service = module.get<MetodosEnvioService>(MetodosEnvioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all metodos de envio', async () => {
      const mockMetodos = [{ id_metodo_envio: 'ME001', nombre: 'Express' }];
      metodoEnvioRepository.find.mockResolvedValue(mockMetodos as any);
      const result = await service.findAll();
      expect(result).toEqual(mockMetodos);
      expect(metodoEnvioRepository.find).toHaveBeenCalled();
    });
  });
});
