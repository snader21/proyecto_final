import { Test, TestingModule } from '@nestjs/testing';
import { TiposRutasController } from './tipos-rutas.controller';
import { TiposRutasService } from './tipos-rutas.service';

describe('TiposRutasController', () => {
  let controller: TiposRutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposRutasController],
      providers: [TiposRutasService],
    }).compile();

    controller = module.get<TiposRutasController>(TiposRutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
