/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FabricanteController } from './fabricante.controller';
import { FabricanteService } from '../services/fabricante.service';
import { CreateFabricanteDto } from '../dto/create-fabricante.dto';
import { UpdateFabricanteDto } from '../dto/update-fabricante.dto';

describe('FabricanteController', () => {
  let fabricanteController: FabricanteController;
  let fabricanteService: FabricanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FabricanteController],
      providers: [
        {
          provide: FabricanteService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: '1',
              nombre: 'Test Fabricante',
              correo: 'test@example.com',
              direccion: 'Test Direccion',
              estado: 'activo',
              telefono: '123456789',
              ciudad_id: '1',
              pais_id: '1',
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                id: '1',
                nombre: 'Test Fabricante',
                correo: 'test@example.com',
                direccion: 'Test Direccion',
                estado: 'activo',
                telefono: '123456789',
                ciudad_id: '1',
                pais_id: '1',
              },
            ]),
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              nombre: 'Test Fabricante',
              correo: 'test@example.com',
              direccion: 'Test Direccion',
              estado: 'activo',
              telefono: '123456789',
              ciudad_id: '1',
              pais_id: '1',
            }),
            remove: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue({
              id: '1',
              nombre: 'Updated Fabricante',
              correo: 'updated@example.com',
              direccion: 'Updated Direccion',
              estado: 'activo',
              telefono: '987654321',
              ciudad_id: '2',
              pais_id: '2',
            }),
          },
        },
      ],
    }).compile();

    fabricanteController =
      module.get<FabricanteController>(FabricanteController);
    fabricanteService = module.get<FabricanteService>(FabricanteService);
  });

  it('debería estar definido', () => {
    expect(fabricanteController).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un fabricante', async () => {
      const createFabricanteDto: CreateFabricanteDto = {
        nombre: 'Test Fabricante',
        correo: 'test@example.com',
        direccion: 'Test Direccion',
        estado: 'activo',
        telefono: '123456789',
        ciudad_id: '1',
        pais_id: '1',
      };

      const result = await fabricanteController.create(createFabricanteDto);

      expect(result).toEqual({
        id: '1',
        ...createFabricanteDto,
      });
      expect(fabricanteService.create).toHaveBeenCalledWith(
        createFabricanteDto,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar una lista de fabricantes', async () => {
      const result = await fabricanteController.findAll();

      expect(result).toEqual([
        {
          id: '1',
          nombre: 'Test Fabricante',
          correo: 'test@example.com',
          direccion: 'Test Direccion',
          estado: 'activo',
          telefono: '123456789',
          ciudad_id: '1',
          pais_id: '1',
        },
      ]);
      expect(fabricanteService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un fabricante por ID', async () => {
      const result = await fabricanteController.findOne('1');

      expect(result).toEqual({
        id: '1',
        nombre: 'Test Fabricante',
        correo: 'test@example.com',
        direccion: 'Test Direccion',
        estado: 'activo',
        telefono: '123456789',
        ciudad_id: '1',
        pais_id: '1',
      });
      expect(fabricanteService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('debería actualizar un fabricante', async () => {
      const updateFabricanteDto: UpdateFabricanteDto = {
        nombre: 'Updated Fabricante',
        correo: 'updated@example.com',
        direccion: 'Updated Direccion',
        estado: 'activo',
        telefono: '987654321',
        ciudad_id: '2',
        pais_id: '2',
      };

      const result = await fabricanteController.update(
        '1',
        updateFabricanteDto,
      );

      expect(result).toEqual({
        id: '1',
        ...updateFabricanteDto,
      });
      expect(fabricanteService.update).toHaveBeenCalledWith(
        '1',
        updateFabricanteDto,
      );
    });
  });
});
