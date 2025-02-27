import { Test, TestingModule } from '@nestjs/testing';
import { NodosRutasService } from './nodos-rutas.service';

describe('NodosRutasService', () => {
  let service: NodosRutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodosRutasService],
    }).compile();

    service = module.get<NodosRutasService>(NodosRutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
