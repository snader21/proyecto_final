/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FabricanteService } from './fabricante.service';
import { Fabricante } from '../entities/fabricante.entity';
import { Lugar } from '../entities/lugar.entity';
import { CreateFabricanteDto } from '../dto/create-fabricante.dto';
import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FabricanteService', () => {
  let fabricanteService: FabricanteService;
  let fabricanteRepository: Repository<Fabricante>;
  let lugarRepository: Repository<Lugar>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FabricanteService,
        {
          provide: getRepositoryToken(Fabricante),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Lugar),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              nombre: 'Test Ciudad',
              lugar_padre: { id: '1', nombre: 'Test País' },
            }),
          },
        },
      ],
    }).compile();

    fabricanteService = module.get<FabricanteService>(FabricanteService);
    fabricanteRepository = module.get<Repository<Fabricante>>(
      getRepositoryToken(Fabricante),
    );
    lugarRepository = module.get<Repository<Lugar>>(getRepositoryToken(Lugar));
  });

  it('debería estar definido', () => {
    expect(fabricanteService).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un fabricante con un nombre aleatorio', async () => {
      const createFabricanteDto: CreateFabricanteDto = {
        nombre: faker.company.name(),
        correo: faker.internet.email(),
        direccion: faker.location.streetAddress(),
        estado: 'activo',
        telefono: faker.phone.number(),
        ciudad_id: '1',
        pais_id: '1',
      };

      const fabricanteMock = {
        id: '1',
        ...createFabricanteDto,
        lugar: {
          id: '1',
          nombre: 'Test Ciudad',
          lugar_padre: { id: '1', nombre: 'Test País' },
        },
      };

      // Simula que no existe un fabricante con el mismo nombre
      jest.spyOn(fabricanteRepository, 'findOne').mockResolvedValue(null);

      // Simula el método `create` del repositorio
      jest
        .spyOn(fabricanteRepository, 'create')
        .mockReturnValue(fabricanteMock as unknown as Fabricante);
      jest
        .spyOn(fabricanteRepository, 'save')
        .mockResolvedValue(fabricanteMock as unknown as Fabricante);

      const result = await fabricanteService.create(createFabricanteDto);

      expect(result).toEqual(fabricanteMock);
      expect(fabricanteRepository.create).toHaveBeenCalledWith(
        createFabricanteDto,
      );
      expect(fabricanteRepository.save).toHaveBeenCalledWith(fabricanteMock);
    });

    it('debería lanzar ConflictException si el fabricante ya está registrado', async () => {
      const createFabricanteDto: CreateFabricanteDto = {
        nombre: 'Test Fabricante',
        correo: 'test@example.com',
        direccion: 'Test Direccion',
        estado: 'activo',
        telefono: '123456789',
        ciudad_id: '1',
        pais_id: '1',
      };

      // Simula que ya existe un fabricante con el mismo nombre
      jest.spyOn(fabricanteRepository, 'findOne').mockResolvedValue({
        id: '1',
        ...createFabricanteDto,
      } as unknown as Fabricante);

      await expect(
        fabricanteService.create(createFabricanteDto),
      ).rejects.toThrow(ConflictException);
      expect(fabricanteRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: createFabricanteDto.nombre },
      });
    });

    it('debería lanzar NotFoundException si la ciudad no existe', async () => {
      const createFabricanteDto: CreateFabricanteDto = {
        nombre: 'Test Fabricante',
        correo: 'test@example.com',
        direccion: 'Test Direccion',
        estado: 'activo',
        telefono: '123456789',
        ciudad_id: '1',
        pais_id: '1',
      };

      // Simula que no existe un fabricante con el mismo nombre
      jest.spyOn(fabricanteRepository, 'findOne').mockResolvedValue(null);

      // Simula que no existe la ciudad
      jest.spyOn(lugarRepository, 'findOne').mockResolvedValue(null);

      await expect(
        fabricanteService.create(createFabricanteDto),
      ).rejects.toThrow(NotFoundException);
      expect(lugarRepository.findOne).toHaveBeenCalledWith({
        where: { id: createFabricanteDto.ciudad_id },
      });
    });
  });

  describe('findAll', () => {
    it('debería retornar una lista de fabricantes', async () => {
      const fabricanteMock = [
        {
          id: '1',
          nombre: 'Test Fabricante',
          correo: 'test@example.com',
          direccion: 'Test Direccion',
          estado: 'activo',
          telefono: '123456789',
          lugar: {
            id: '1',
            nombre: 'Test Ciudad',
            lugar_padre: { id: '1', nombre: 'Test País' },
          },
        },
      ];

      jest
        .spyOn(fabricanteRepository, 'find')
        .mockResolvedValue(fabricanteMock as unknown as Fabricante[]);

      const result = await fabricanteService.findAll();

      expect(result).toEqual([
        {
          id: '1',
          nombre: 'Test Fabricante',
          correo: 'test@example.com',
          direccion: 'Test Direccion',
          estado: 'activo',
          telefono: '123456789',
          ciudad_id: '1',
          ciudad_nombre: 'Test Ciudad',
          pais_id: '1',
          pais_nombre: 'Test País',
        },
      ]);
      expect(fabricanteRepository.find).toHaveBeenCalled();
    });
  });
});
