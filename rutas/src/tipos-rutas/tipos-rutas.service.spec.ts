import { Test, TestingModule } from '@nestjs/testing';
import { TiposRutasService } from './tipos-rutas.service';
import { TipoRutaEntity } from './entities/tipo-ruta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TiposRutasService', () => {
  let service: TiposRutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiposRutasService,
        {
          provide: getRepositoryToken(TipoRutaEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TiposRutasService>(TiposRutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
