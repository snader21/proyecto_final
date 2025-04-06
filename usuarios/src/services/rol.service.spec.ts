import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolService } from './rol.service';
import { Rol } from '../entities/rol.entity';
import { Permiso } from '../entities/permiso.entity';
import { CreateRolDto } from '../dto/create-rol.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RolService', () => {
  let service: RolService;
  let rolRepository: Repository<Rol>;
  let permisoRepository: Repository<Permiso>;

  const mockRolRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockPermisoRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolService,
        {
          provide: getRepositoryToken(Rol),
          useValue: mockRolRepository,
        },
        {
          provide: getRepositoryToken(Permiso),
          useValue: mockPermisoRepository,
        },
      ],
    }).compile();

    service = module.get<RolService>(RolService);
    rolRepository = module.get<Repository<Rol>>(getRepositoryToken(Rol));
    permisoRepository = module.get<Repository<Permiso>>(getRepositoryToken(Permiso));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const expectedRoles = [{ id: '1', nombre: 'Test Role' }];
      mockRolRepository.find.mockResolvedValue(expectedRoles);

      const result = await service.findAll();

      expect(result).toEqual(expectedRoles);
      expect(mockRolRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role if found', async () => {
      const expectedRole = { id: '1', nombre: 'Test Role' };
      mockRolRepository.findOne.mockResolvedValue(expectedRole);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedRole);
      expect(mockRolRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if role not found', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a role if found by name', async () => {
      const expectedRole = { id: '1', nombre: 'Test Role' };
      mockRolRepository.findOne.mockResolvedValue(expectedRole);

      const result = await service.findByName('Test Role');

      expect(result).toEqual(expectedRole);
      expect(mockRolRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: 'Test Role' },
      });
    });

    it('should throw NotFoundException if role not found by name', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);

      await expect(service.findByName('Test Role')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createRolDto: CreateRolDto = {
      nombre: 'Test Role',
      descripcion: 'Test Description',
      permisos: ['1'],
    };

    it('should create a role successfully', async () => {
      const permiso = { id: '1', nombre: 'Test Permission' };
      const createdRole = {
        id: '1',
        ...createRolDto,
        permisos: [permiso],
      };

      mockRolRepository.findOne.mockResolvedValue(null);
      mockPermisoRepository.findOneBy.mockResolvedValue(permiso);
      mockRolRepository.create.mockReturnValue(createdRole);
      mockRolRepository.save.mockResolvedValue(createdRole);

      const result = await service.create(createRolDto);

      expect(result).toEqual(createdRole);
      expect(mockRolRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: createRolDto.nombre },
      });
      expect(mockPermisoRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockRolRepository.create).toHaveBeenCalled();
      expect(mockRolRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if role name already exists', async () => {
      mockRolRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.create(createRolDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);
      mockPermisoRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createRolDto)).rejects.toThrow(NotFoundException);
    });

    it('should create a role without permissions', async () => {
      const createRolDtoWithoutPermisos = {
        nombre: 'Test Role',
        descripcion: 'Test Description',
      };

      const createdRole = {
        id: '1',
        ...createRolDtoWithoutPermisos,
      };

      mockRolRepository.findOne.mockResolvedValue(null);
      mockRolRepository.create.mockReturnValue(createdRole);
      mockRolRepository.save.mockResolvedValue(createdRole);

      const result = await service.create(createRolDtoWithoutPermisos);

      expect(result).toEqual(createdRole);
      expect(mockRolRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: createRolDtoWithoutPermisos.nombre },
      });
      expect(mockPermisoRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockRolRepository.create).toHaveBeenCalled();
      expect(mockRolRepository.save).toHaveBeenCalled();
    });
  });
});
