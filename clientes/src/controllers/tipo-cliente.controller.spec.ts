/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TipoClienteController } from './tipo-cliente.controller';
import { TipoClienteService } from '../services/tipo-cliente.service';
import { TipoCliente } from '../entities/tipo-cliente.entity.ts';

describe('TipoClienteController', () => {
  let tipoClienteController: TipoClienteController;
  let tipoClienteService: TipoClienteService;

  const tipoClienteMock: TipoCliente = {
    id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440000',
    tipo_cliente: 'Individual',
    clientes: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoClienteController],
      providers: [
        {
          provide: TipoClienteService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([tipoClienteMock]),
            findOne: jest.fn().mockImplementation(() => {
              return Promise.resolve(tipoClienteMock);
            }),
            create: jest.fn().mockResolvedValue(tipoClienteMock),
            update: jest.fn().mockResolvedValue(tipoClienteMock),
            remove: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    tipoClienteController = module.get<TipoClienteController>(
      TipoClienteController,
    );
    tipoClienteService = module.get<TipoClienteService>(TipoClienteService);
  });

  it('debería estar definido', () => {
    expect(tipoClienteController).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar una lista de tipos de cliente', async () => {
      const result = await tipoClienteController.findAll();

      expect(result).toEqual([tipoClienteMock]);
      expect(tipoClienteService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un tipo de cliente por ID', async () => {
      const result = await tipoClienteController.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(tipoClienteMock);
      expect(tipoClienteService.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });
  });
});
