import { Test, TestingModule } from '@nestjs/testing';
import { ZonasService } from './zonas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ZonaEntity } from './entities/zona.entity';
import { Repository } from 'typeorm';

describe('ZonasService', () => {
  let service: ZonasService;
  let zonaRepo: any;

  beforeEach(async () => {
    // Crear mock del repositorio
    zonaRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonasService,
        {
          provide: getRepositoryToken(ZonaEntity),
          useValue: zonaRepo,
        },
      ],
    }).compile();

    service = module.get<ZonasService>(ZonasService);

    // Limpiar todos los mocks después de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('debería inicializar 5 zonas en la base de datos', async () => {
      // Arrange
      zonaRepo.save.mockResolvedValue({});

      // Act
      await service.onModuleInit();

      // Assert
      expect(zonaRepo.save).toHaveBeenCalledTimes(5);

      // Verificar que se llame con los datos correctos para cada zona
      for (let i = 1; i <= 5; i++) {
        const uuidBase = 'dbbc9d28-da65-4d92-8969-76c376c3152';
        expect(zonaRepo.save).toHaveBeenCalledWith({
          id: uuidBase + i,
          nombre: `Zona ${i}`,
          descripcion: `Zona ${i}`,
        });
      }
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las zonas', async () => {
      // Arrange
      const zonasMock = [
        { id: '1', nombre: 'Zona 1', descripcion: 'Zona 1', vendedores: [] },
        { id: '2', nombre: 'Zona 2', descripcion: 'Zona 2', vendedores: [] },
      ];
      zonaRepo.find.mockResolvedValue(zonasMock);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(zonasMock);
      expect(zonaRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar una zona por su ID', async () => {
      // Arrange
      const id = 'dbbc9d28-da65-4d92-8969-76c376c31521';
      const zonaMock = { id, nombre: 'Zona 1', descripcion: 'Zona 1', vendedores: [] };
      zonaRepo.findOne.mockResolvedValue(zonaMock);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toEqual(zonaMock);
      expect(zonaRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('debería retornar null si la zona no existe', async () => {
      // Arrange
      const id = 'id-inexistente';
      zonaRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toBeNull();
      expect(zonaRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
