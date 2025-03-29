import { Test, TestingModule } from '@nestjs/testing';
import { CamionesService } from './camiones.service';
import { CamionEntity } from './entities/camion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CamionesService', () => {
  let service: CamionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CamionesService,
        {
          provide: getRepositoryToken(CamionEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CamionesService>(CamionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
