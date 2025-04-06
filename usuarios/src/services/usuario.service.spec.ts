import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import { CreateUsuarioDto, EstadoUsuario } from '../dto/create-usuario.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<Usuario>;
  let rolRepository: Repository<Rol>;

  const mockUsuarioRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockRolRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(Rol),
          useValue: mockRolRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    rolRepository = module.get<Repository<Rol>>(getRepositoryToken(Rol));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [{ id: '1', nombre: 'Test User' }];
      mockUsuarioRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockUsuarioRepository.find).toHaveBeenCalledWith({
        relations: ['roles'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const expectedUser = { id: '1', nombre: 'Test User' };
      mockUsuarioRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedUser);
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['roles'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user if found', async () => {
      const user = { id: '1', nombre: 'Test User' };
      mockUsuarioRepository.findOne.mockResolvedValue(user);
      mockUsuarioRepository.remove.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockUsuarioRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUsuarioDto = {
      nombre: 'Test User',
      correo: 'test@test.com',
      contrasena: 'password123',
      estado: EstadoUsuario.ACTIVE,
      roles: ['1'],
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      const rol = { id: '1', nombre: 'Test Rol' };
      const createdUser = {
        id: '1',
        ...createUserDto,
        contrasena_hash: hashedPassword,
        roles: [rol],
      };

      mockUsuarioRepository.findOne.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRolRepository.findOneBy.mockResolvedValue(rol);
      mockUsuarioRepository.create.mockReturnValue(createdUser);
      mockUsuarioRepository.save.mockResolvedValue(createdUser);
      mockUsuarioRepository.findOne.mockResolvedValueOnce(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRolRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockUsuarioRepository.create).toHaveBeenCalled();
      expect(mockUsuarioRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if role not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValueOnce(null);
      mockRolRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(NotFoundException);
    });
  });
});
