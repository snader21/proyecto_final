import { Test, TestingModule } from '@nestjs/testing';
import { CamionesController } from './camiones.controller';
import { CamionesService } from './camiones.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CamionEntity } from './entities/camion.entity';

describe('CamionesController', () => {
  let controller: CamionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CamionesController],
      providers: [
        CamionesService,
        {
          provide: getRepositoryToken(CamionEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CamionesController>(CamionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
