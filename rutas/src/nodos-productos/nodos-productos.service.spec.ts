import { Test, TestingModule } from '@nestjs/testing';
import { NodosProductosService } from './nodos-productos.service';

describe('NodosProductosService', () => {
  let service: NodosProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodosProductosService],
    }).compile();

    service = module.get<NodosProductosService>(NodosProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
