/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LugarService } from './lugar.service';
import { Lugar } from '../entities/lugar.entity';
import { NotFoundException } from '@nestjs/common';

describe('LugarService', () => {
  let lugarService: LugarService;
  let lugarRepository: Repository<Lugar>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LugarService,
        {
          provide: getRepositoryToken(Lugar),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    lugarService = module.get<LugarService>(LugarService);
    lugarRepository = module.get<Repository<Lugar>>(getRepositoryToken(Lugar));
  });

  it('debería estar definido', () => {
    expect(lugarService).toBeDefined();
  });

  describe('findAllLugares', () => {
    it('debería retornar una lista de lugares', async () => {
      const lugarMock = [
        {
          id: '1',
          nombre: 'Madrid',
          tipo: 'Ciudad',
          lugar_padre_id: '1',
        },
        {
          id: '2',
          nombre: 'España',
          tipo: 'Pais',
          lugar_padre_id: null,
        },
      ];

      jest
        .spyOn(lugarRepository, 'find')
        .mockResolvedValue(lugarMock as Lugar[]);

      const result = await lugarService.findAllLugares();

      expect(result).toEqual(lugarMock);
      expect(lugarRepository.find).toHaveBeenCalled();
    });
  });

  describe('findLugaresByTipo', () => {
    it('debería retornar lugares filtrados por tipo', async () => {
      const tipo = 'Ciudad';
      const lugarMock = [
        {
          id: '1',
          nombre: 'Madrid',
          tipo: 'Ciudad',
          lugar_padre_id: '1',
        },
        {
          id: '2',
          nombre: 'Barcelona',
          tipo: 'Ciudad',
          lugar_padre_id: '1',
        },
      ];

      jest
        .spyOn(lugarRepository, 'find')
        .mockResolvedValue(lugarMock as Lugar[]);

      const result = await lugarService.findLugaresByTipo(tipo);

      expect(result).toEqual(lugarMock);
      expect(lugarRepository.find).toHaveBeenCalledWith({ where: { tipo } });
    });
  });

  describe('findLugaresByTipoCiudadAndPais', () => {
    it('debería retornar ciudades de un país específico', async () => {
      const paisId = '1';
      const lugarMock = [
        {
          id: '1',
          nombre: 'Madrid',
          tipo: 'Ciudad',
          lugar_padre_id: paisId,
        },
        {
          id: '2',
          nombre: 'Barcelona',
          tipo: 'Ciudad',
          lugar_padre_id: paisId,
        },
      ];

      jest
        .spyOn(lugarRepository, 'find')
        .mockResolvedValue(lugarMock as Lugar[]);

      const result = await lugarService.findLugaresByTipoCiudadAndPais(paisId);

      expect(result).toEqual(lugarMock);
      expect(lugarRepository.find).toHaveBeenCalledWith({
        where: { tipo: 'Ciudad', lugar_padre_id: paisId },
      });
    });
  });

  describe('findLugarById', () => {
    it('debería retornar un lugar por su ID', async () => {
      const id = '1';
      const lugarMock = {
        id: '1',
        nombre: 'Madrid',
        tipo: 'Ciudad',
        lugar_padre_id: '1',
      };

      jest
        .spyOn(lugarRepository, 'findOne')
        .mockResolvedValue(lugarMock as Lugar);

      const result = await lugarService.findLugarById(id);

      expect(result).toEqual(lugarMock);
      expect(lugarRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('debería lanzar NotFoundException si el lugar no existe', async () => {
      const id = '999';

      jest.spyOn(lugarRepository, 'findOne').mockResolvedValue(null);

      await expect(lugarService.findLugarById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(lugarRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
