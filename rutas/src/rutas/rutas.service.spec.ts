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
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { BadRequestException } from '@nestjs/common';
import { RutasVisitaVendedores } from './dto/rutas-visita-vendedores.dto';

describe('RutasService', () => {
  let service: RutasService;
  let rutaRepo: jest.Mocked<Repository<RutaEntity>>;
  let nodosRutasService: jest.Mocked<NodosRutasService>;
  let tiposRutasService: jest.Mocked<TiposRutasService>;
  let estadosRutasService: jest.Mocked<EstadosRutasService>;
  let camionesService: jest.Mocked<CamionesService>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    // Crear mocks para todos los repositorios y servicios
    rutaRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<RutaEntity>>;

    nodosRutasService = {
      bulkCreateNodos: jest.fn(),
    } as unknown as jest.Mocked<NodosRutasService>;

    tiposRutasService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<TiposRutasService>;

    estadosRutasService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<EstadosRutasService>;

    camionesService = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<CamionesService>;

    // Mock para EntityManager
    entityManager = {
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    // Mock para QueryRunner
    queryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: entityManager,
    } as unknown as jest.Mocked<QueryRunner>;

    // Mock para DataSource
    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as unknown as jest.Mocked<DataSource>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RutasService,
        {
          provide: NodosRutasService,
          useValue: nodosRutasService,
        },
        {
          provide: TiposRutasService,
          useValue: tiposRutasService,
        },
        {
          provide: EstadosRutasService,
          useValue: estadosRutasService,
        },
        {
          provide: CamionesService,
          useValue: camionesService,
        },
        {
          provide: getRepositoryToken(RutaEntity),
          useValue: rutaRepo,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<RutasService>(RutasService);

    // Limpiar todos los mocks después de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRutaDeEntregaDePedidos', () => {
    it('debería crear rutas de entrega de pedidos correctamente', async () => {
      // Arrange
      const createRutaDto: CreateRutaDto[] = [
        {
          fecha: '2025-05-18',
          duracionEstimada: 120,
          distanciaTotal: 50.5,
          camionId: 'camion-1',
          nodos: [
            {
              numeroNodoProgramado: 1,
              latitud: 4.6097,
              longitud: -74.0817,
              direccion: 'Dirección 1',
              hora_llegada: '08:00',
              hora_salida: '08:30',
              id_bodega: 'bodega-1',
              id_cliente: null,
              id_pedido: 'pedido-1',
              productos: [] as any,
            },
          ],
        },
      ];

      const tipoRuta = { id: 'tipo-1', tipo_ruta: 'Entrega de pedido', rutas: [] } as unknown as TipoRutaEntity;
      const estadoRuta = { id: 'estado-1', estado_ruta: 'Programada', rutas: [] } as unknown as EstadoRutaEntity;
      const camion = {
        id: 'camion-1',
        placa: 'ABC123',
        nombre_conductor: 'Conductor Test',
        celular_conductor: '1234567890',
        capacidad: 1000,
        rutas: []
      } as unknown as CamionEntity;
      const rutaCreada = {
        id: 'ruta-1',
        fecha: '2025-05-18',
        numero_ruta: 1,
        duracion_estimada: 120,
        duracion_final: null,
        distancia_total: 50.5,
        vendedor_id: null,
        tipo_ruta: tipoRuta,
        estado_ruta: estadoRuta,
        camion: camion,
        nodos_rutas: []
      } as unknown as RutaEntity;

      // Configurar mocks
      tiposRutasService.findAll.mockResolvedValue([tipoRuta]);
      estadosRutasService.findAll.mockResolvedValue([estadoRuta]);
      camionesService.findOne.mockResolvedValue(camion);
      entityManager.save.mockResolvedValue(rutaCreada);
      nodosRutasService.bulkCreateNodos.mockResolvedValue([]);
      rutaRepo.findOne.mockResolvedValue({
        ...rutaCreada,
        tipo_ruta: tipoRuta,
        estado_ruta: estadoRuta,
        camion,
        nodos_rutas: [],
      });

      // Act
      const result = await service.createRutaDeEntregaDePedidos(createRutaDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ruta-1');
      expect(tiposRutasService.findAll).toHaveBeenCalled();
      expect(estadosRutasService.findAll).toHaveBeenCalled();
      expect(camionesService.findOne).toHaveBeenCalledWith('camion-1');
      expect(nodosRutasService.bulkCreateNodos).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('debería manejar errores al crear rutas de entrega de pedidos', async () => {
      // Arrange
      const createRutaDto: CreateRutaDto[] = [
        {
          fecha: '2025-05-18',
          duracionEstimada: 120,
          distanciaTotal: 50.5,
          camionId: 'camion-1',
          nodos: [],
        },
      ];

      // Configurar mocks para simular un error
      tiposRutasService.findAll.mockResolvedValue([]);

      // Act & Assert
      await expect(service.createRutaDeEntregaDePedidos(createRutaDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('createRutaDeVisitaVendedores', () => {
    it('debería crear rutas de visita a vendedores con array de CreateRutaDto', async () => {
      // Arrange
      const createRutaDto: CreateRutaDto[] = [
        {
          fecha: '2025-05-18',
          duracionEstimada: 120,
          distanciaTotal: 50.5,
          vendedor_id: 'vendedor-1',
          nodos: [
            {
              numeroNodoProgramado: 1,
              latitud: 4.6097,
              longitud: -74.0817,
              direccion: 'Dirección 1',
              hora_llegada: '08:00',
              hora_salida: '08:30',
              id_bodega: null,
              id_cliente: 'cliente-1',
              id_pedido: null,
              productos: [] as any,
            },
          ],
        },
      ];

      const tipoRuta = { id: 'tipo-2', tipo_ruta: 'Visita a cliente', rutas: [] } as unknown as TipoRutaEntity;
      const estadoRuta = { id: 'estado-1', estado_ruta: 'Programada', rutas: [] } as unknown as EstadoRutaEntity;
      const rutaCreada = {
        id: 'ruta-2',
        fecha: '2025-05-18',
        numero_ruta: 2,
        duracion_estimada: 120,
        duracion_final: null,
        distancia_total: 50.5,
        vendedor_id: 'vendedor-1',
        tipo_ruta: tipoRuta,
        estado_ruta: estadoRuta,
        camion: null,
        nodos_rutas: []
      } as unknown as RutaEntity;

      // Configurar mocks
      tiposRutasService.findAll.mockResolvedValue([tipoRuta]);
      estadosRutasService.findAll.mockResolvedValue([estadoRuta]);
      entityManager.save.mockResolvedValue(rutaCreada);
      nodosRutasService.bulkCreateNodos.mockResolvedValue([]);
      rutaRepo.findOne.mockResolvedValue({
        ...rutaCreada,
        tipo_ruta: tipoRuta,
        estado_ruta: estadoRuta,
        camion: null,
        nodos_rutas: [],
      });

      // Act
      const result = await service.createRutaDeVisitaVendedores(createRutaDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ruta-2');
      expect(tiposRutasService.findAll).toHaveBeenCalled();
      expect(estadosRutasService.findAll).toHaveBeenCalled();
      expect(nodosRutasService.bulkCreateNodos).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('debería crear rutas de visita a vendedores con RutasVisitaVendedores', async () => {
      // Arrange
      const rutasVisita: RutasVisitaVendedores = {
        vendedores: [
          {
            id_vendedor: 'vendedor-1',
            visitas_programadas: [
              {
                fecha: '2025-05-18',
                duracionEstimada: 120,
                distanciaTotal: 50.5,
                camionId: null,
                nodos: [
                  {
                    numeroNodoProgramado: 1,
                    latitud: 4.6097,
                    longitud: -74.0817,
                    direccion: 'Dirección 1',
                    hora_llegada: '08:00',
                    hora_salida: '08:30',
                    id_cliente: 'cliente-1',
                    id_bodega: null,
                    id_pedido: null,
                    productos: [] as any,
                  },
                ],
              },
            ],
          },
        ],
      };

      const tipoRuta = { id: 'tipo-2', tipo_ruta: 'Visita a cliente', rutas: [] } as unknown as TipoRutaEntity;
      const estadoRuta = { id: 'estado-1', estado_ruta: 'Programada', rutas: [] } as unknown as EstadoRutaEntity;
      const rutaCreada = {
        id: 'ruta-2',
        fecha: '2025-05-18',
        numero_ruta: 2,
        duracion_estimada: 120,
        duracion_final: null,
        distancia_total: 50.5,
        vendedor_id: 'vendedor-1',
        tipo_ruta: tipoRuta,
        estado_ruta: estadoRuta,
        camion: null,
        nodos_rutas: []
      } as unknown as RutaEntity;

      // Configurar mocks
      tiposRutasService.findAll.mockResolvedValue([tipoRuta]);
      estadosRutasService.findAll.mockResolvedValue([estadoRuta]);
      entityManager.save.mockResolvedValue(rutaCreada);
      nodosRutasService.bulkCreateNodos.mockResolvedValue([]);
      rutaRepo.findOne.mockResolvedValue({
        ...rutaCreada,
        tipo_ruta: tipoRuta,
        estado_ruta: estadoRuta,
        camion: null,
        nodos_rutas: [],
      });

      // Act
      const result = await service.createRutaDeVisitaVendedores(rutasVisita);

      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('ruta-2');
      expect(tiposRutasService.findAll).toHaveBeenCalled();
      expect(estadosRutasService.findAll).toHaveBeenCalled();
      expect(nodosRutasService.bulkCreateNodos).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('debería manejar errores al crear rutas de visita a vendedores', async () => {
      // Arrange
      const rutasVisita: RutasVisitaVendedores = {
        vendedores: [
          {
            id_vendedor: 'vendedor-1',
            visitas_programadas: [
              {
                fecha: '2025-05-18',
                duracionEstimada: 120,
                distanciaTotal: 50.5,
                camionId: null,
                nodos: [],
              },
            ],
          },
        ],
      };

      // Configurar mocks para simular un error
      tiposRutasService.findAll.mockResolvedValue([]);

      // Act & Assert
      await expect(service.createRutaDeVisitaVendedores(rutasVisita)).rejects.toThrow(
        BadRequestException,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las rutas', async () => {
      // Arrange
      const rutas = [
        {
          id: 'ruta-1',
          fecha: '2025-05-18',
          numero_ruta: 1,
          duracion_estimada: 120,
          duracion_final: null,
          distancia_total: 50.5,
          vendedor_id: null,
          tipo_ruta: { id: 'tipo-1', tipo_ruta: 'Entrega de pedido', rutas: [] } as unknown as TipoRutaEntity,
          estado_ruta: { id: 'estado-1', estado_ruta: 'Programada', rutas: [] } as unknown as EstadoRutaEntity,
          camion: null,
          nodos_rutas: []
        } as unknown as RutaEntity,
        {
          id: 'ruta-2',
          fecha: '2025-05-19',
          numero_ruta: 2,
          duracion_estimada: 120,
          duracion_final: null,
          distancia_total: 50.5,
          vendedor_id: null,
          tipo_ruta: { id: 'tipo-1', tipo_ruta: 'Entrega de pedido', rutas: [] } as unknown as TipoRutaEntity,
          estado_ruta: { id: 'estado-1', estado_ruta: 'Programada', rutas: [] } as unknown as EstadoRutaEntity,
          camion: null,
          nodos_rutas: []
        } as unknown as RutaEntity,
      ];
      rutaRepo.find.mockResolvedValue(rutas);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(rutas);
      expect(rutaRepo.find).toHaveBeenCalledWith({
        relations: ['tipo_ruta', 'estado_ruta', 'camion', 'nodos_rutas'],
      });
    });
  });

  describe('findOne', () => {
    it('debería retornar una ruta por su ID', async () => {
      // Arrange
      const id = 'ruta-1';
      const ruta = {
        id,
        fecha: '2025-05-18',
        numero_ruta: 1,
        duracion_estimada: 120,
        duracion_final: null,
        distancia_total: 50.5,
        vendedor_id: null,
        tipo_ruta: { id: 'tipo-1', tipo_ruta: 'Entrega de pedido', rutas: [] } as unknown as TipoRutaEntity,
        estado_ruta: { id: 'estado-1', estado_ruta: 'Programada', rutas: [] } as unknown as EstadoRutaEntity,
        camion: null,
        nodos_rutas: []
      } as unknown as RutaEntity;
      rutaRepo.findOne.mockResolvedValue(ruta);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toEqual(ruta);
      expect(rutaRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['tipo_ruta', 'estado_ruta', 'camion', 'nodos_rutas', 'nodos_rutas.productos'],
      });
    });

    it('debería retornar null si la ruta no existe', async () => {
      // Arrange
      const id = 'ruta-inexistente';
      rutaRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toBeNull();
      expect(rutaRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['tipo_ruta', 'estado_ruta', 'camion', 'nodos_rutas', 'nodos_rutas.productos'],
      });
    });
  });

  describe('update', () => {
    it('debería actualizar una ruta', () => {
      // Arrange
      const id = 1;
      const expectedResult = `This action updates a #${id} ruta`;

      // Act
      const result = service.update(id);

      // Assert
      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('debería eliminar una ruta', () => {
      // Arrange
      const id = 1;
      const expectedResult = `This action removes a #${id} ruta`;

      // Act
      const result = service.remove(id);

      // Assert
      expect(result).toBe(expectedResult);
    });
  });
});
