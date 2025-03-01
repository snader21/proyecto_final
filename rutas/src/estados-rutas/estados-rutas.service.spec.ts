import { Test, TestingModule } from '@nestjs/testing';
import { EstadosRutasService } from './estados-rutas.service';

describe('EstadosRutasService', () => {
  let service: EstadosRutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadosRutasService],
    }).compile();

    service = module.get<EstadosRutasService>(EstadosRutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
