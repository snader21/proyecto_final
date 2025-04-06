import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto, EstadoUsuario } from '../dto/create-usuario.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const mockUsuarioService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUsuarioDto: CreateUsuarioDto = {
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena: 'password123',
        estado: EstadoUsuario.ACTIVE,
        roles: ['1'],
      };

      const expectedUser = {
        id: '1',
        nombre: 'Test User',
        correo: 'test@example.com',
        estado: true,
        roles: [{ id: '1', nombre: 'Admin' }],
      };

      mockUsuarioService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUsuarioDto);

      expect(result).toBe(expectedUser);
      expect(service.create).toHaveBeenCalledWith(createUsuarioDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        {
          id: '1',
          nombre: 'Test User',
          correo: 'test@example.com',
          estado: true,
          roles: [{ id: '1', nombre: 'Admin' }],
        },
      ];

      mockUsuarioService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll();

      expect(result).toBe(expectedUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const expectedUser = {
        id: '1',
        nombre: 'Test User',
        correo: 'test@example.com',
        estado: true,
        roles: [{ id: '1', nombre: 'Admin' }],
      };

      mockUsuarioService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne('1');

      expect(result).toBe(expectedUser);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUsuarioService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsuarioService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user to remove is not found', async () => {
      mockUsuarioService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith('999');
    });
  });
});
