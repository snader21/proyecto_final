import { Test, TestingModule } from '@nestjs/testing';
import { EstadosRutasService } from './estados-rutas.service';
import { EstadoRutaEntity } from './entities/estado-ruta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EstadosRutasService', () => {
  let service: EstadosRutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstadosRutasService,
        {
          provide: getRepositoryToken(EstadoRutaEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EstadosRutasService>(EstadosRutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
