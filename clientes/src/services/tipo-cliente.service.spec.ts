/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoClienteService } from './tipo-cliente.service';
import { TipoCliente } from '../entities/tipo-cliente.entity.ts';
import { NotFoundException } from '@nestjs/common';

describe('TipoClienteService', () => {
  let tipoClienteService: TipoClienteService;
  let tipoClienteRepository: Repository<TipoCliente>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipoClienteService,
        {
          provide: getRepositoryToken(TipoCliente),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    tipoClienteService = module.get<TipoClienteService>(TipoClienteService);
    tipoClienteRepository = module.get<Repository<TipoCliente>>(
      getRepositoryToken(TipoCliente),
    );
  });

  it('debería estar definido', () => {
    expect(tipoClienteService).toBeDefined();
  });

  describe('findAllTipoClientes', () => {
    it('debería retornar una lista de tipos de cliente', async () => {
      const tiposClienteMock: TipoCliente[] = [
        {
          id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440001',
          tipo_cliente: 'Individual',
          clientes: [],
        },
        {
          id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
          tipo_cliente: 'Empresa',
          clientes: [],
        },
      ];

      jest
        .spyOn(tipoClienteRepository, 'find')
        .mockResolvedValue(tiposClienteMock);

      const result = await tipoClienteService.findAll();

      expect(result).toEqual(tiposClienteMock);
      expect(tipoClienteRepository.find).toHaveBeenCalled();
    });
  });

  describe('findTipoClienteById', () => {
    it('debería retornar un tipo de cliente por su ID', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';
      const tipoClienteMock: TipoCliente = {
        id_tipo_cliente: id,
        tipo_cliente: 'Individual',
        clientes: [],
      };

      jest
        .spyOn(tipoClienteRepository, 'findOne')
        .mockResolvedValue(tipoClienteMock);

      const result = await tipoClienteService.findOne(id);

      expect(result).toEqual(tipoClienteMock);
      expect(tipoClienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_tipo_cliente: id },
      });
    });

    it('debería lanzar NotFoundException si el tipo de cliente no existe', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440999';

      jest.spyOn(tipoClienteRepository, 'findOne').mockResolvedValue(null);

      await expect(tipoClienteService.findOne(id)).rejects.toThrow(
        new NotFoundException(`Tipo de cliente con ID ${id} no encontrado`),
      );
      expect(tipoClienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_tipo_cliente: id },
      });
    });
  });
});
