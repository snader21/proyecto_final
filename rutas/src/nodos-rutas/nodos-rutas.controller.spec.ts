import { Test, TestingModule } from '@nestjs/testing';
import { NodosRutasController } from './nodos-rutas.controller';
import { NodosRutasService } from './nodos-rutas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NodoRutaEntity } from './entities/nodo-ruta.entity';
import { NodoProductoEntity } from '../nodos-productos/entities/nodo-producto.entity';
import { NodosProductosService } from '../nodos-productos/nodos-productos.service';
describe('NodosRutasController', () => {
  let controller: NodosRutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodosRutasController],
      providers: [
        NodosRutasService,
        NodosProductosService,
        {
          provide: getRepositoryToken(NodoRutaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(NodoProductoEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<NodosRutasController>(NodosRutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
