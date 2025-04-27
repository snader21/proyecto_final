import { Test, TestingModule } from '@nestjs/testing';
import { MetodosEnvioController } from './metodos-envio.controller';
import { MetodosEnvioService } from './metodos-envio.service';

describe('MetodosEnvioController', () => {
  let controller: MetodosEnvioController;
  let metodosEnvioService: MetodosEnvioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosEnvioController],
      providers: [
        {
          provide: MetodosEnvioService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MetodosEnvioController>(MetodosEnvioController);
    metodosEnvioService = module.get<MetodosEnvioService>(MetodosEnvioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all metodos de envio', async () => {
      const mockMetodos = [{ id_metodo_envio: 'ME001', nombre: 'Express' }];
      jest.spyOn(metodosEnvioService, 'findAll').mockResolvedValue(mockMetodos as any);
      const result = await controller.findAll();
      expect(result).toEqual(mockMetodos);
      expect(metodosEnvioService.findAll).toHaveBeenCalled();
    });
  });
});
