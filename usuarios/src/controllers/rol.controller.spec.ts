import { Test, TestingModule } from '@nestjs/testing';
import { RolController } from './rol.controller';
import { RolService } from '../services/rol.service';
import { CreateRolDto } from '../dto/create-rol.dto';
import { Rol } from '../entities/rol.entity';
import { NotFoundException } from '@nestjs/common';

describe('RolController', () => {
  let controller: RolController;
  let service: RolService;

  const mockRolService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolController],
      providers: [
        {
          provide: RolService,
          useValue: mockRolService,
        },
      ],
    }).compile();

    controller = module.get<RolController>(RolController);
    service = module.get<RolService>(RolService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const expectedRoles = [
        {
          id: '1',
          nombre: 'Admin',
          descripcion: 'Administrator role',
        },
      ];
      mockRolService.findAll.mockResolvedValue(expectedRoles);

      const result = await controller.findAll();

      expect(result).toBe(expectedRoles);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      const expectedRole = {
        id: '1',
        nombre: 'Admin',
        descripcion: 'Administrator role',
      };
      mockRolService.findOne.mockResolvedValue(expectedRole);

      const result = await controller.findOne('1');

      expect(result).toBe(expectedRole);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when role is not found', async () => {
      mockRolService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRolDto: CreateRolDto = {
        nombre: 'Admin',
        descripcion: 'Administrator role',
        permisos: ['1', '2'],
      };

      const expectedRole = {
        id: '1',
        ...createRolDto,
      };

      mockRolService.create.mockResolvedValue(expectedRole);

      const result = await controller.create(createRolDto);

      expect(result).toBe(expectedRole);
      expect(service.create).toHaveBeenCalledWith(createRolDto);
    });
  });
});
