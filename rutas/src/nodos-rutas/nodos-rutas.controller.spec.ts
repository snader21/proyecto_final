import { Test, TestingModule } from '@nestjs/testing';
import { NodosRutasController } from './nodos-rutas.controller';
import { NodosRutasService } from './nodos-rutas.service';

describe('NodosRutasController', () => {
  let controller: NodosRutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodosRutasController],
      providers: [NodosRutasService],
    }).compile();

    controller = module.get<NodosRutasController>(NodosRutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
