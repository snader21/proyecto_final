import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitService } from './init.service';
import { Rol } from '../entities/rol.entity';
import { Permiso, TipoRecurso } from '../entities/permiso.entity';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { EstadoUsuario } from '../dto/create-usuario.dto';

describe('InitService', () => {
  let service: InitService;
  let rolRepository: Repository<Rol>;
  let permisoRepository: Repository<Permiso>;
  let usuarioRepository: Repository<Usuario>;
  let usuarioService: UsuarioService;

  const mockRolRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockPermisoRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUsuarioRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUsuarioService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitService,
        {
          provide: getRepositoryToken(Rol),
          useValue: mockRolRepository,
        },
        {
          provide: getRepositoryToken(Permiso),
          useValue: mockPermisoRepository,
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    service = module.get<InitService>(InitService);
    rolRepository = module.get<Repository<Rol>>(getRepositoryToken(Rol));
    permisoRepository = module.get<Repository<Permiso>>(getRepositoryToken(Permiso));
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    usuarioService = module.get<UsuarioService>(UsuarioService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create roles if they do not exist', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);
      mockRolRepository.save.mockImplementation((rol) => ({
        id: '1',
        ...rol,
      }));

      await service.onModuleInit();

      expect(mockRolRepository.findOne).toHaveBeenCalled();
      expect(mockRolRepository.save).toHaveBeenCalled();
    });

    it('should not create roles if they already exist', async () => {
      const existingRole = {
        id: '1',
        nombre: 'Administrador',
        descripcion: 'Usuario con acceso total al sistema',
      };
      mockRolRepository.findOne.mockResolvedValue(existingRole);

      await service.onModuleInit();

      expect(mockRolRepository.findOne).toHaveBeenCalled();
      expect(mockRolRepository.save).not.toHaveBeenCalledWith(existingRole);
    });

    it('should create permisos if they do not exist', async () => {
      mockPermisoRepository.findOne.mockResolvedValue(null);
      mockPermisoRepository.save.mockImplementation((permiso) => ({
        id: '1',
        ...permiso,
      }));

      await service.onModuleInit();

      expect(mockPermisoRepository.findOne).toHaveBeenCalled();
      expect(mockPermisoRepository.save).toHaveBeenCalled();
    });

    it('should update permisos if they already exist', async () => {
      const existingPermiso = {
        id: '1',
        nombre: 'Acceso a Módulo de usuarios',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'usuarios',
      };
      mockPermisoRepository.findOne.mockResolvedValue(existingPermiso);
      mockPermisoRepository.save.mockImplementation((permiso) => ({
        id: '1',
        ...permiso,
      }));

      await service.onModuleInit();

      expect(mockPermisoRepository.findOne).toHaveBeenCalled();
      expect(mockPermisoRepository.save).toHaveBeenCalled();
    });

    it('should assign permisos to roles', async () => {
      const mockRol = {
        id: '1',
        nombre: 'Administrador',
        permisos: [],
      };
      const mockPermiso = {
        id: '1',
        nombre: 'Acceso a Módulo de usuarios',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'usuarios',
      };

      mockRolRepository.findOne
        .mockResolvedValueOnce(null) // Para la creación inicial
        .mockResolvedValueOnce(mockRol); // Para la asignación de permisos
      mockRolRepository.save.mockImplementation((rol) => rol);
      mockPermisoRepository.findOne.mockResolvedValue(null);
      mockPermisoRepository.save.mockResolvedValue(mockPermiso);

      await service.onModuleInit();

      expect(mockRolRepository.save).toHaveBeenCalled();
    });

    it('should create admin user', async () => {
      const mockRol = {
        id: '1',
        nombre: 'Administrador',
      };
      mockRolRepository.findOne.mockResolvedValue(mockRol);
      mockUsuarioService.create.mockResolvedValue({
        id: '1',
        nombre: 'Administrador',
        correo: 'admin@example.com',
      });

      await service.onModuleInit();

      expect(mockUsuarioService.create).toHaveBeenCalledWith({
        nombre: 'Administrador',
        correo: 'admin@example.com',
        contrasena: 'admin123',
        estado: EstadoUsuario.ACTIVE,
        roles: [mockRol.id],
      });
    });

    it('should handle error when creating admin user', async () => {
      const mockRol = {
        id: '1',
        nombre: 'Administrador',
      };
      mockRolRepository.findOne.mockResolvedValue(mockRol);
      mockUsuarioService.create.mockRejectedValue(new Error('Test error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.onModuleInit();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error al crear el usuario administrador',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });
});
