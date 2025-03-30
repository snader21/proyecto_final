import { Test, TestingModule } from '@nestjs/testing';
import { NodosRutasService } from './nodos-rutas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NodoRutaEntity } from './entities/nodo-ruta.entity';
import { NodoProductoEntity } from '../nodos-productos/entities/nodo-producto.entity';
import { NodosProductosService } from '../nodos-productos/nodos-productos.service';
describe('NodosRutasService', () => {
  let service: NodosRutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<NodosRutasService>(NodosRutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
