import { Test, TestingModule } from '@nestjs/testing';
import { NodosProductosController } from './nodos-productos.controller';
import { NodosProductosService } from './nodos-productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NodoProductoEntity } from './entities/nodo-producto.entity';

describe('NodosProductosController', () => {
  let controller: NodosProductosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodosProductosController],
      providers: [
        NodosProductosService,
        {
          provide: getRepositoryToken(NodoProductoEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<NodosProductosController>(NodosProductosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
