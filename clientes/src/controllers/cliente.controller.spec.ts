/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { GetClienteDto } from '../dto/get-cliente.dto';
import { Cliente } from '../entities/cliente.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClienteController', () => {
  let clienteController: ClienteController;
  let clienteService: ClienteService;

  const tipoClienteIndividualMock = {
    id_tipo_cliente: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    tipo_cliente: 'Individual',
  };

  const clienteMock: Cliente = {
    id_cliente: 'c1d2e3f4-g5h6-7890-1234-567890abcdef',
    nombre: 'Juan Perez',
    id_tipo_cliente: tipoClienteIndividualMock.id_tipo_cliente,
    tipoCliente: tipoClienteIndividualMock as any,
    direccion: 'Calle Falsa 123',
    telefono: '555-1234',
    pais: 'España',
    ciudad: 'Madrid',
    documento_identidad: '12345678A',
    lat: 40.416775,
    lng: -3.70379,
  };

  const clientesDtoMock: GetClienteDto[] = [
    {
      id_cliente: clienteMock.id_cliente,
      nombre: clienteMock.nombre,
      direccion: clienteMock.direccion,
      telefono: clienteMock.telefono,
      pais: clienteMock.pais,
      ciudad: clienteMock.ciudad,
      documento_identidad: clienteMock.documento_identidad,
      lat: clienteMock.lat,
      lng: clienteMock.lng,
      id_tipo_cliente: clienteMock.id_tipo_cliente,
      tipo_cliente_nombre: tipoClienteIndividualMock.tipo_cliente,
    },
    {
      id_cliente: 'd2e3f4g5-h6i7-8901-2345-67890abcdef',
      nombre: 'Empresa ABC',
      direccion: 'Av. Siempre Viva 742',
      telefono: '555-5678',
      pais: 'México',
      ciudad: 'Ciudad de México',
      documento_identidad: 'ABC-XYZ',
      lat: 19.432608,
      lng: -99.133209,
      id_tipo_cliente: 'b2c3d4e5-f678-9012-3456-7890abcdef12',
      tipo_cliente_nombre: 'Empresa',
    },
  ];

  const createClienteDtoMock: CreateClienteDto = {
    nombre: 'Nuevo Cliente',
    id_tipo_cliente: tipoClienteIndividualMock.id_tipo_cliente,
    direccion: 'Direccion Nueva',
    telefono: '111-1111',
    pais: 'Pais Nuevo',
    ciudad: 'Ciudad Nueva',
    documento_identidad: 'NUEVO-DOC',
    lat: 1.1,
    lng: 2.2,
  };

  const updateClienteDtoMock: UpdateClienteDto = {
    direccion: 'Direccion Actualizada',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
          useValue: {
            create: jest.fn().mockResolvedValue(clienteMock),
            findAll: jest.fn().mockResolvedValue(clientesDtoMock),
            findOne: jest.fn().mockResolvedValue(clienteMock),
            update: jest
              .fn()
              .mockResolvedValue({ ...clienteMock, ...updateClienteDtoMock }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    clienteController = module.get<ClienteController>(ClienteController);
    clienteService = module.get<ClienteService>(ClienteService);
  });

  it('debería estar definido', () => {
    expect(clienteController).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un nuevo cliente', async () => {
      const result = await clienteController.create(createClienteDtoMock);

      expect(result).toEqual(clienteMock);
      expect(clienteService.create).toHaveBeenCalledWith(createClienteDtoMock);
    });
  });

  describe('findAll', () => {
    it('debería retornar una lista de clientes con su tipo (DTOs)', async () => {
      const result = await clienteController.findAll();

      expect(result).toEqual(clientesDtoMock);
      expect(clienteService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un cliente por ID', async () => {
      const id = clienteMock.id_cliente;

      const result = await clienteController.findOne(id);

      expect(result).toEqual(clienteMock);
      expect(clienteService.findOne).toHaveBeenCalledWith(id);
    });

    it('debería lanzar NotFoundException si el cliente no existe', async () => {
      const id = 'non-existent-client-uuid';

      jest
        .spyOn(clienteService, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Cliente con ID ${id} no encontrado`),
        );

      await expect(clienteController.findOne(id)).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(clienteService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('debería actualizar un cliente existente', async () => {
      const id = clienteMock.id_cliente;

      const updatedClienteMock = { ...clienteMock, ...updateClienteDtoMock };
      jest
        .spyOn(clienteService, 'update')
        .mockResolvedValue(updatedClienteMock as Cliente);

      const result = await clienteController.update(id, updateClienteDtoMock);

      expect(result).toEqual(updatedClienteMock);
      expect(clienteService.update).toHaveBeenCalledWith(
        id,
        updateClienteDtoMock,
      );
    });

    it('debería lanzar NotFoundException si el cliente a actualizar no existe', async () => {
      const id = 'non-existent-client-uuid';

      jest
        .spyOn(clienteService, 'update')
        .mockRejectedValue(
          new NotFoundException(`Cliente con ID ${id} no encontrado`),
        );

      await expect(
        clienteController.update(id, updateClienteDtoMock),
      ).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(clienteService.update).toHaveBeenCalledWith(
        id,
        updateClienteDtoMock,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar un cliente por su ID', async () => {
      const id = clienteMock.id_cliente;

      jest.spyOn(clienteService, 'remove').mockResolvedValue(undefined);

      const result = await clienteController.remove(id);

      expect(result).toBeUndefined();
      expect(clienteService.remove).toHaveBeenCalledWith(id);
    });

    it('debería lanzar NotFoundException si el cliente a eliminar no existe', async () => {
      const id = 'non-existent-client-uuid';

      jest
        .spyOn(clienteService, 'remove')
        .mockRejectedValue(
          new NotFoundException(`Cliente con ID ${id} no encontrado`),
        );

      await expect(clienteController.remove(id)).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(clienteService.remove).toHaveBeenCalledWith(id);
    });
  });
});
