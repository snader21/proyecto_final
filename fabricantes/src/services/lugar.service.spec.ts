/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LugarService } from './lugar.service';
import { Lugar } from '../entities/lugar.entity';

describe('LugarService', () => {
  let lugarService: LugarService;
  let lugarRepository: Repository<Lugar>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LugarService,
        {
          provide: getRepositoryToken(Lugar),
          useClass: Repository,
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
          nombre: 'Test Lugar',
          tipo: 'Ciudad',
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
});
