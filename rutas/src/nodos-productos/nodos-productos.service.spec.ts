import { Test, TestingModule } from '@nestjs/testing';
import { NodosProductosService } from './nodos-productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NodoProductoEntity } from './entities/nodo-producto.entity';

describe('NodosProductosService', () => {
  let service: NodosProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodosProductosService,
        {
          provide: getRepositoryToken(NodoProductoEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<NodosProductosService>(NodosProductosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
