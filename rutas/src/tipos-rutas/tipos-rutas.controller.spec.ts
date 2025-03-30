import { Test, TestingModule } from '@nestjs/testing';
import { TiposRutasController } from './tipos-rutas.controller';
import { TiposRutasService } from './tipos-rutas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipoRutaEntity } from './entities/tipo-ruta.entity';

describe('TiposRutasController', () => {
  let controller: TiposRutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposRutasController],
      providers: [
        TiposRutasService,
        {
          provide: getRepositoryToken(TipoRutaEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TiposRutasController>(TiposRutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
