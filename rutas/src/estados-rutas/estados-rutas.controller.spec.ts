import { Test, TestingModule } from '@nestjs/testing';
import { EstadosRutasController } from './estados-rutas.controller';
import { EstadosRutasService } from './estados-rutas.service';
import { EstadoRutaEntity } from './entities/estado-ruta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('EstadosRutasController', () => {
  let controller: EstadosRutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosRutasController],
      providers: [
        EstadosRutasService,
        {
          provide: getRepositoryToken(EstadoRutaEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EstadosRutasController>(EstadosRutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
