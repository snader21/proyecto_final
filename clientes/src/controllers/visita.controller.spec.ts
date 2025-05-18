import { Test, TestingModule } from '@nestjs/testing';
import { VisitaController } from './visita.controller';
import { VisitaService } from '../services/visita.service';
import { CreateVisitaDto } from '../dto/create-visita.dto';
import { VisitaCliente } from '../entities/visita-cliente.entity';
import { v4 as uuidv4 } from 'uuid';

describe('VisitaController', () => {
  let controller: VisitaController;
  let service: VisitaService;

  // Mock del servicio de visitas
  const mockVisitaService = {
    create: jest.fn(),
    findByCliente: jest.fn(),
    obtenerTodosLosClientesConUltimaVisita: jest.fn(),
    getUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitaController],
      providers: [
        {
          provide: VisitaService,
          useValue: mockVisitaService,
        },
      ],
    }).compile();

    controller = module.get<VisitaController>(VisitaController);
    service = module.get<VisitaService>(VisitaService);

    // Limpiar todos los mocks después de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registrarVisita', () => {
    it('debería registrar una nueva visita correctamente', async () => {
      // Arrange
      const createVisitaDto: CreateVisitaDto = {
        id_cliente: uuidv4(),
        fecha_visita: new Date(),
        observaciones: 'Visita de prueba',
        realizo_pedido: false,
      };

      const file = {
        fieldname: 'video',
        originalname: 'test-video.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        buffer: Buffer.from('test video content'),
        size: 1024,
        destination: '',
        filename: '',
        path: '',
        stream: null as any,
      } as Express.Multer.File;

      const visitaCreada = {
        id_visita: uuidv4(),
        id_cliente: createVisitaDto.id_cliente,
        fecha_visita: createVisitaDto.fecha_visita,
        observaciones: createVisitaDto.observaciones || '',
        realizo_pedido: createVisitaDto.realizo_pedido,
        key_object_storage: 'test-video-uuid.mp4',
        recomendacion: '',
        cliente: null as any,
      } as unknown as VisitaCliente;

      mockVisitaService.create.mockResolvedValue(visitaCreada);

      // Act
      const result = await controller.registrarVisita(file, createVisitaDto);

      // Assert
      expect(result).toEqual(visitaCreada);
      expect(mockVisitaService.create).toHaveBeenCalledWith(createVisitaDto, file);
    });

    it('debería registrar una visita sin archivo de video', async () => {
      // Arrange
      const createVisitaDto: CreateVisitaDto = {
        id_cliente: uuidv4(),
        fecha_visita: new Date(),
        observaciones: 'Visita sin video',
        realizo_pedido: true,
      };

      const visitaCreada = {
        id_visita: uuidv4(),
        id_cliente: createVisitaDto.id_cliente,
        fecha_visita: createVisitaDto.fecha_visita,
        observaciones: createVisitaDto.observaciones || '',
        realizo_pedido: createVisitaDto.realizo_pedido,
        key_object_storage: '',
        recomendacion: '',
        cliente: {} as any,
      } as unknown as VisitaCliente;

      mockVisitaService.create.mockResolvedValue(visitaCreada);

      // Act
      const result = await controller.registrarVisita(null as any, createVisitaDto);

      // Assert
      expect(result).toEqual(visitaCreada);
      expect(mockVisitaService.create).toHaveBeenCalledWith(createVisitaDto, null);
    });
  });

  describe('obtenerVisitasCliente', () => {
    it('debería obtener todas las visitas de un cliente', async () => {
      // Arrange
      const id_cliente = uuidv4();
      const visitas = [
        {
          id_visita: uuidv4(),
          id_cliente,
          fecha_visita: new Date(),
          observaciones: 'Visita 1',
          realizo_pedido: false,
          key_object_storage: 'video1.mp4',
          recomendacion: '',
          cliente: null as any,
        },
        {
          id_visita: uuidv4(),
          id_cliente,
          fecha_visita: new Date(),
          observaciones: 'Visita 2',
          realizo_pedido: true,
          key_object_storage: 'video2.mp4',
          recomendacion: '',
          cliente: null as any,
        },
      ] as unknown as VisitaCliente[];

      mockVisitaService.findByCliente.mockResolvedValue(visitas);

      // Act
      const result = await controller.obtenerVisitasCliente(id_cliente);

      // Assert
      expect(result).toEqual(visitas);
      expect(mockVisitaService.findByCliente).toHaveBeenCalledWith(id_cliente);
    });

    it('debería retornar un array vacío si el cliente no tiene visitas', async () => {
      // Arrange
      const id_cliente = uuidv4();
      mockVisitaService.findByCliente.mockResolvedValue([]);

      // Act
      const result = await controller.obtenerVisitasCliente(id_cliente);

      // Assert
      expect(result).toEqual([]);
      expect(mockVisitaService.findByCliente).toHaveBeenCalledWith(id_cliente);
    });
  });

  describe('obtenerTodosLosClientesConUltimaVisita', () => {
    it('debería obtener todos los clientes con su última visita agrupados por vendedor', async () => {
      // Arrange
      const clientesConVisitas = [
        {
          id_vendedor: uuidv4(),
          clientes: [
            {
              id_cliente: uuidv4(),
              id_vendedor: uuidv4(),
              ultima_visita: new Date(),
              lat: 4.6097,
              lng: -74.0817,
            },
            {
              id_cliente: uuidv4(),
              id_vendedor: uuidv4(),
              ultima_visita: new Date(),
              lat: 4.6098,
              lng: -74.0818,
            },
          ],
        },
      ];

      mockVisitaService.obtenerTodosLosClientesConUltimaVisita.mockResolvedValue(clientesConVisitas);

      // Act
      const result = await controller.obtenerTodosLosClientesConUltimaVisita();

      // Assert
      expect(result).toEqual(clientesConVisitas);
      expect(mockVisitaService.obtenerTodosLosClientesConUltimaVisita).toHaveBeenCalled();
    });
  });

  describe('obtenerUrlVideo', () => {
    it('debería obtener la URL firmada de un video', async () => {
      // Arrange
      const key = 'video-test.mp4';
      const urlResponse = { url: 'https://storage.googleapis.com/bucket/videos/video-test.mp4?token=abc123' };

      mockVisitaService.getUrl.mockResolvedValue(urlResponse);

      // Act
      const result = await controller.obtenerUrlVideo(key);

      // Assert
      expect(result).toEqual(urlResponse);
      expect(mockVisitaService.getUrl).toHaveBeenCalledWith(key);
    });
  });
});