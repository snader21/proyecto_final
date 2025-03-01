import { Test, TestingModule } from '@nestjs/testing';
import { EstadosRutasController } from './estados-rutas.controller';
import { EstadosRutasService } from './estados-rutas.service';

describe('EstadosRutasController', () => {
  let controller: EstadosRutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosRutasController],
      providers: [EstadosRutasService],
    }).compile();

    controller = module.get<EstadosRutasController>(EstadosRutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
