/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { LugarController } from './lugar.controller';
import { LugarService } from '../services/lugar.service';

describe('LugarController', () => {
  let lugarController: LugarController;
  let lugarService: LugarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LugarController],
      providers: [
        {
          provide: LugarService,
          useValue: {
            findAllLugares: jest.fn().mockResolvedValue([
              { id: '1', nombre: 'Lugar 1', tipo: 'Ciudad' },
              { id: '2', nombre: 'Lugar 2', tipo: 'Pais' },
            ]),
            findLugaresByTipo: jest.fn().mockImplementation((tipo: string) => {
              return Promise.resolve([
                { id: '1', nombre: 'Lugar 1', tipo },
                { id: '2', nombre: 'Lugar 2', tipo },
              ]);
            }),
            findLugaresByTipoCiudadAndPais: jest
              .fn()
              .mockResolvedValue([
                { id: '1', nombre: 'Ciudad 1', tipo: 'Ciudad' },
              ]),
            findLugarById: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ id, nombre: 'Lugar 1', tipo: 'Ciudad' });
            }),
          },
        },
      ],
    }).compile();

    lugarController = module.get<LugarController>(LugarController);
    lugarService = module.get<LugarService>(LugarService);
  });

  it('debería estar definido', () => {
    expect(lugarController).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar una lista de lugares', async () => {
      const result = await lugarController.findAll();

      expect(result).toEqual([
        { id: '1', nombre: 'Lugar 1', tipo: 'Ciudad' },
        { id: '2', nombre: 'Lugar 2', tipo: 'Pais' },
      ]);
      expect(lugarService.findAllLugares).toHaveBeenCalled();
    });
  });

  describe('findLugaresByTipo', () => {
    it('debería retornar una lista de lugares por tipo (Ciudad)', async () => {
      const result = await lugarController.findLugaresByTipo();

      expect(result).toEqual([
        { id: '1', nombre: 'Lugar 1', tipo: 'Ciudad' },
        { id: '2', nombre: 'Lugar 2', tipo: 'Ciudad' },
      ]);
      expect(lugarService.findLugaresByTipo).toHaveBeenCalledWith('Ciudad');
    });

    it('debería retornar una lista de lugares por tipo (Pais)', async () => {
      const result = await lugarController.findLugaresByTipoPais();

      expect(result).toEqual([
        { id: '1', nombre: 'Lugar 1', tipo: 'Pais' },
        { id: '2', nombre: 'Lugar 2', tipo: 'Pais' },
      ]);
      expect(lugarService.findLugaresByTipo).toHaveBeenCalledWith('Pais');
    });
  });

  describe('findLugaresByTipoCiudadAndPais', () => {
    it('debería retornar una lista de ciudades por país', async () => {
      const result = await lugarController.findLugaresByTipoCiudadAndPais('1');

      expect(result).toEqual([{ id: '1', nombre: 'Ciudad 1', tipo: 'Ciudad' }]);
      expect(lugarService.findLugaresByTipoCiudadAndPais).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('findOne', () => {
    it('debería retornar un lugar por ID', async () => {
      const result = await lugarController.findOne('1');

      expect(result).toEqual({ id: '1', nombre: 'Lugar 1', tipo: 'Ciudad' });
      expect(lugarService.findLugarById).toHaveBeenCalledWith('1');
    });
  });
});
