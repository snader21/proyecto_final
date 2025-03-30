import { Test, TestingModule } from '@nestjs/testing';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { RutaEntity } from './entities/ruta.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NodoRutaEntity } from '../nodos-rutas/entities/nodo-ruta.entity';
import { NodoProductoEntity } from '../nodos-productos/entities/nodo-producto.entity';
import { EstadoRutaEntity } from '../estados-rutas/entities/estado-ruta.entity';
import { NodosRutasService } from '../nodos-rutas/nodos-rutas.service';
import { TiposRutasService } from '../tipos-rutas/tipos-rutas.service';
import { CamionesService } from '../camiones/camiones.service';
import { NodosProductosService } from '../nodos-productos/nodos-productos.service';
import { TipoRutaEntity } from '../tipos-rutas/entities/tipo-ruta.entity';
import { EstadosRutasService } from '../estados-rutas/estados-rutas.service';
import { CamionEntity } from '../camiones/entities/camion.entity';
import { DataSource } from 'typeorm';
describe('RutasController', () => {
  let controller: RutasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RutasController],
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

    controller = module.get<RutasController>(RutasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
