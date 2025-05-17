/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteService } from './cliente.service';
import { Cliente } from '../entities/cliente.entity';
import { TipoCliente } from '../entities/tipo-cliente.entity.ts';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { GetClienteDto } from '../dto/get-cliente.dto';
import { IsNull } from 'typeorm';

describe('ClienteService', () => {
  let clienteService: ClienteService;
  let clienteRepository: Repository<Cliente>;
  let tipoClienteRepository: Repository<TipoCliente>;

  const tipoClienteIndividualMock: TipoCliente = {
    id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440000',
    tipo_cliente: 'Individual',
    clientes: [],
  };

  const clienteMock: Cliente = {
    id_cliente: '550e8400-e29b-41d4-a716-446655440001',
    id_usuario: '550e8400-e29b-41d4-a716-446655440002',
    nombre: 'Juan Perez',
    id_tipo_cliente: tipoClienteIndividualMock.id_tipo_cliente,
    tipoCliente: tipoClienteIndividualMock,
    direccion: 'Calle Falsa 123',
    telefono: '555-1234',
    pais: 'España',
    ciudad: 'Madrid',
    documento_identidad: '12345678A',
    lat: 40.416775,
    lng: -3.70379,
    id_vendedor: null,
    visitas: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(TipoCliente),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    clienteService = module.get<ClienteService>(ClienteService);
    clienteRepository = module.get<Repository<Cliente>>(
      getRepositoryToken(Cliente),
    );
    tipoClienteRepository = module.get<Repository<TipoCliente>>(
      getRepositoryToken(TipoCliente),
    );
  });

  it('debería estar definido', () => {
    expect(clienteService).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar una lista de clientes con su tipo', async () => {
      const otrosClientesMock: Cliente[] = [
        clienteMock,
        {
          id_cliente: '550e8400-e29b-41d4-a716-446655440002',
          id_usuario: '550e8400-e29b-41d4-a716-446655440002',
          nombre: 'Empresa ABC',
          id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
          tipoCliente: {
            id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
            tipo_cliente: 'Empresa',
            clientes: [],
          },
          direccion: 'Av. Siempre Viva 742',
          telefono: '555-5678',
          pais: 'México',
          ciudad: 'Ciudad de México',
          documento_identidad: 'ABC-XYZ',
          lat: 19.432608,
          lng: -99.133209,
        } as unknown as Cliente,
      ];

      const clientesDtoMock: GetClienteDto[] = otrosClientesMock.map((c) => ({
        id_cliente: c.id_cliente,
        nombre: c.nombre,
        direccion: c.direccion,
        telefono: c.telefono,
        pais: c.pais,
        ciudad: c.ciudad,
        documento_identidad: c.documento_identidad,
        lat: c.lat,
        lng: c.lng,
        id_tipo_cliente: c.tipoCliente?.id_tipo_cliente,
        tipo_cliente_nombre: c.tipoCliente?.tipo_cliente,
      }));

      jest
        .spyOn(clienteRepository, 'find')
        .mockResolvedValue(otrosClientesMock);

      const result = await clienteService.findAll();

      expect(result).toEqual(clientesDtoMock);
      expect(clienteRepository.find).toHaveBeenCalledWith({
        relations: ['tipoCliente'],
      });
    });
  });

  describe('findOne', () => {
    it('debería retornar un cliente por su ID', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440001';

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(clienteMock);

      const result = await clienteService.findOne(id);

      expect(result).toEqual(clienteMock);
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: id },
        relations: ['tipoCliente'],
      });
    });

    it('debería lanzar NotFoundException si el cliente no existe', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(null);

      await expect(clienteService.findOne(id)).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: id },
        relations: ['tipoCliente'],
      });
    });
  });

  describe('create', () => {
    const createClienteDtoMock: CreateClienteDto = {
      nombre: 'Nuevo Cliente',
      id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440000',
      direccion: 'Direccion Nueva',
      telefono: '111-1111',
      pais: 'Pais Nuevo',
      ciudad: 'Ciudad Nueva',
      documento_identidad: 'NUEVO-DOC',
      lat: 1.1,
      lng: 2.2,
    };

    it('debería crear un nuevo cliente', async () => {
      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(tipoClienteRepository, 'findOne')
        .mockResolvedValue(tipoClienteIndividualMock);
      jest.spyOn(clienteRepository, 'create').mockReturnValue(clienteMock);
      jest.spyOn(clienteRepository, 'save').mockResolvedValue(clienteMock);

      const result = await clienteService.create(createClienteDtoMock);

      expect(result).toEqual(clienteMock);
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: createClienteDtoMock.nombre },
      });
      if (createClienteDtoMock.documento_identidad) {
        expect(clienteRepository.findOne).toHaveBeenCalledWith({
          where: {
            documento_identidad: createClienteDtoMock.documento_identidad,
          },
        });
      }
      expect(tipoClienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_tipo_cliente: createClienteDtoMock.id_tipo_cliente },
      });
      expect(clienteRepository.create).toHaveBeenCalledWith(
        createClienteDtoMock,
      );
      expect(clienteRepository.save).toHaveBeenCalledWith(clienteMock);
    });

    it('debería lanzar ConflictException si el cliente ya existe por nombre', async () => {
      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(clienteMock);
      jest
        .spyOn(tipoClienteRepository, 'findOne')
        .mockResolvedValue(tipoClienteIndividualMock);

      await expect(clienteService.create(createClienteDtoMock)).rejects.toThrow(
        new ConflictException(
          `El nombre del cliente "${createClienteDtoMock.nombre}" ya está registrado`,
        ),
      );
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: createClienteDtoMock.nombre },
      });
      expect(tipoClienteRepository.findOne).not.toHaveBeenCalled();
      expect(clienteRepository.create).not.toHaveBeenCalled();
      expect(clienteRepository.save).not.toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si el tipo de cliente no existe', async () => {
      const createClienteDtoWithInvalidType: CreateClienteDto = {
        ...createClienteDtoMock,
        id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
      };

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(tipoClienteRepository, 'findOne').mockResolvedValue(null);

      await expect(
        clienteService.create(createClienteDtoWithInvalidType),
      ).rejects.toThrow(
        new BadRequestException(
          `El tipo de cliente con ID ${createClienteDtoWithInvalidType.id_tipo_cliente} no está registrado`,
        ),
      );
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: createClienteDtoWithInvalidType.nombre },
      });
      expect(tipoClienteRepository.findOne).toHaveBeenCalledWith({
        where: {
          id_tipo_cliente: createClienteDtoWithInvalidType.id_tipo_cliente,
        },
      });
      expect(clienteRepository.create).not.toHaveBeenCalled();
      expect(clienteRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateClienteDtoMock: UpdateClienteDto = {
      direccion: 'Nueva Direccion Actualizada',
      id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
    };

    const tipoClienteEmpresaMock: TipoCliente = {
      id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
      tipo_cliente: 'Empresa',
      clientes: [],
    };

    it('debería actualizar un cliente existente', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440001';

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(clienteMock);
      jest
        .spyOn(tipoClienteRepository, 'findOne')
        .mockResolvedValue(tipoClienteEmpresaMock);
      jest.spyOn(clienteRepository, 'merge').mockReturnValue({
        ...clienteMock,
        ...updateClienteDtoMock,
      } as Cliente);
      jest.spyOn(clienteRepository, 'save').mockResolvedValue({
        ...clienteMock,
        ...updateClienteDtoMock,
      } as Cliente);

      const result = await clienteService.update(id, updateClienteDtoMock);

      expect(result).toEqual({ ...clienteMock, ...updateClienteDtoMock });
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: id },
      });
      expect(tipoClienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_tipo_cliente: updateClienteDtoMock.id_tipo_cliente },
      });
      expect(clienteRepository.merge).toHaveBeenCalledWith(
        clienteMock,
        updateClienteDtoMock,
      );
      expect(clienteRepository.save).toHaveBeenCalledWith({
        ...clienteMock,
        ...updateClienteDtoMock,
      });
    });

    it('debería lanzar NotFoundException si el cliente a actualizar no existe', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(null);

      await expect(
        clienteService.update(id, updateClienteDtoMock),
      ).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: id },
      });
      expect(tipoClienteRepository.findOne).not.toHaveBeenCalled();
      expect(clienteRepository.merge).not.toHaveBeenCalled();
      expect(clienteRepository.save).not.toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si el nuevo tipo de cliente especificado no existe', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440001';
      const updateClienteDtoWithInvalidType: UpdateClienteDto = {
        ...updateClienteDtoMock,
        id_tipo_cliente: '550e8400-e29b-41d4-a716-446655440002',
      };

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(clienteMock);
      jest.spyOn(tipoClienteRepository, 'findOne').mockResolvedValue(null);

      await expect(
        clienteService.update(id, updateClienteDtoWithInvalidType),
      ).rejects.toThrow(
        new BadRequestException(
          `El tipo de cliente con ID ${updateClienteDtoWithInvalidType.id_tipo_cliente} no está registrado`,
        ),
      );
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: id },
      });
      expect(tipoClienteRepository.findOne).toHaveBeenCalledWith({
        where: {
          id_tipo_cliente: updateClienteDtoWithInvalidType.id_tipo_cliente,
        },
      });
      expect(clienteRepository.merge).not.toHaveBeenCalled();
      expect(clienteRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar un cliente por su ID', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440001';

      jest
        .spyOn(clienteRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      await clienteService.remove(id);

      expect(clienteRepository.delete).toHaveBeenCalledWith(id);
    });

    it('debería lanzar NotFoundException si el cliente a eliminar no existe', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';

      jest
        .spyOn(clienteRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: {} });

      await expect(clienteService.remove(id)).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${id} no encontrado`),
      );
      expect(clienteRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('findByVendedorId', () => {
    it('debería retornar clientes asignados a un vendedor específico', async () => {
      const id_vendedor = '550e8400-e29b-41d4-a716-446655440003';
      const clientesConVendedor = [
        {
          ...clienteMock,
          id_vendedor: id_vendedor,
        },
      ];

      jest
        .spyOn(clienteRepository, 'find')
        .mockResolvedValue(clientesConVendedor);

      const result = await clienteService.findByVendedorId(id_vendedor);

      expect(result).toEqual(clientesConVendedor);
      expect(clienteRepository.find).toHaveBeenCalledWith({
        where: { id_vendedor: id_vendedor },
        relations: ['tipoCliente'],
      });
    });

    it('debería retornar clientes sin vendedor asignado cuando se pasa null', async () => {
      const clientesSinVendedor = [
        {
          ...clienteMock,
          id_vendedor: null,
        },
      ];

      jest
        .spyOn(clienteRepository, 'find')
        .mockResolvedValue(clientesSinVendedor);

      const result = await clienteService.findByVendedorId(null);

      expect(result).toEqual(clientesSinVendedor);
      expect(clienteRepository.find).toHaveBeenCalledWith({
        where: { id_vendedor: IsNull() },
        relations: ['tipoCliente'],
      });
    });
  });

  describe('assignVendedorToCliente', () => {
    it('debería asignar un vendedor a un cliente', async () => {
      const clienteId = '550e8400-e29b-41d4-a716-446655440001';
      const vendedorId = '550e8400-e29b-41d4-a716-446655440003';
      const clienteActualizado = {
        ...clienteMock,
        id_vendedor: vendedorId,
      };

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(clienteMock);
      jest
        .spyOn(clienteRepository, 'save')
        .mockResolvedValue(clienteActualizado);

      const result = await clienteService.assignVendedorToCliente(
        clienteId,
        vendedorId,
      );

      expect(result).toEqual(clienteActualizado);
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: clienteId },
      });
      expect(clienteRepository.save).toHaveBeenCalledWith({
        ...clienteMock,
        id_vendedor: vendedorId,
      });
    });

    it('debería desasignar un vendedor de un cliente cuando se pasa null', async () => {
      const clienteId = '550e8400-e29b-41d4-a716-446655440001';
      const clienteConVendedor = {
        ...clienteMock,
        id_vendedor: '550e8400-e29b-41d4-a716-446655440003',
      };
      const clienteActualizado = {
        ...clienteMock,
        id_vendedor: null,
      };

      jest
        .spyOn(clienteRepository, 'findOne')
        .mockResolvedValue(clienteConVendedor);
      jest
        .spyOn(clienteRepository, 'save')
        .mockResolvedValue(clienteActualizado);

      const result = await clienteService.assignVendedorToCliente(
        clienteId,
        null,
      );

      expect(result).toEqual(clienteActualizado);
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: clienteId },
      });
      expect(clienteRepository.save).toHaveBeenCalledWith({
        ...clienteConVendedor,
        id_vendedor: null,
      });
    });

    it('debería lanzar NotFoundException si el cliente no existe', async () => {
      const clienteId = '550e8400-e29b-41d4-a716-446655440002';
      const vendedorId = '550e8400-e29b-41d4-a716-446655440003';

      jest.spyOn(clienteRepository, 'findOne').mockResolvedValue(null);

      await expect(
        clienteService.assignVendedorToCliente(clienteId, vendedorId),
      ).rejects.toThrow(
        new NotFoundException(`Cliente con ID ${clienteId} no encontrado`),
      );
      expect(clienteRepository.findOne).toHaveBeenCalledWith({
        where: { id_cliente: clienteId },
      });
      expect(clienteRepository.save).not.toHaveBeenCalled();
    });
  });
});
