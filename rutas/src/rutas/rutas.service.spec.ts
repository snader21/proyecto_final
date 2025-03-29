import { Test, TestingModule } from '@nestjs/testing';
import { RutasService } from './rutas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RutaEntity } from './entities/ruta.entity';
import { NodoRutaEntity } from '../nodos-rutas/entities/nodo-ruta.entity';
import { NodoProductoEntity } from '../nodos-productos/entities/nodo-producto.entity';
import { NodosRutasService } from '../nodos-rutas/nodos-rutas.service';
import { TiposRutasService } from '../tipos-rutas/tipos-rutas.service';
import { EstadosRutasService } from '../estados-rutas/estados-rutas.service';
import { CamionesService } from '../camiones/camiones.service';
import { TipoRutaEntity } from '../tipos-rutas/entities/tipo-ruta.entity';
import { EstadoRutaEntity } from '../estados-rutas/entities/estado-ruta.entity';
import { NodosProductosService } from '../nodos-productos/nodos-productos.service';
import { CamionEntity } from '../camiones/entities/camion.entity';
import { DataSource } from 'typeorm';
describe('RutasService', () => {
  let service: RutasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RutasService,
        NodosRutasService,
        TiposRutasService,
        EstadosRutasService,
        CamionesService,
        NodosProductosService,
        {
          provide: getRepositoryToken(RutaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(NodoProductoEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(NodoRutaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TipoRutaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(EstadoRutaEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CamionEntity),
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RutasService>(RutasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
