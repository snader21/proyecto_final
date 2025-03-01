import { Test, TestingModule } from '@nestjs/testing';
import { TiposRutasService } from './tipos-rutas.service';

describe('TiposRutasService', () => {
  let service: TiposRutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposRutasService],
    }).compile();

    service = module.get<TiposRutasService>(TiposRutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
