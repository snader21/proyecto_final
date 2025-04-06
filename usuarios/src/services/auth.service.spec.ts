import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usuarioRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usuarioRepository = module.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
  });

  it('debería estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('debería retornar un token y datos del usuario si las credenciales son válidas', async () => {
      const loginDto: LoginDto = {
        correo: 'test@example.com',
        contrasena: 'password123',
      };

      const usuarioMock = {
        id: '1',
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena_hash: await bcrypt.hash('password123', 10),
        estado: true,
        roles: [
          {
            id: '1',
            nombre: 'Admin',
            permisos: [
              {
                id: '1',
                nombre: 'Acceso a Módulo de Usuarios',
                modulo: 'usuarios',
                tipoRecurso: 'BACKEND',
              },
            ],
          },
        ],
      };

      jest
        .spyOn(usuarioRepository, 'findOne')
        .mockResolvedValue(usuarioMock as Usuario);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
      expect(result.token).toBe('mockToken');
      expect(result.usuario.correo).toBe(usuarioMock.correo);
    });

    it('debería lanzar una excepción si el correo no está registrado', async () => {
      const loginDto: LoginDto = {
        correo: 'test@example.com',
        contrasena: 'password123',
      };

      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería lanzar una excepción si la contraseña es incorrecta', async () => {
      const loginDto: LoginDto = {
        correo: 'test@example.com',
        contrasena: 'password123',
      };

      const usuarioMock = {
        id: '1',
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena_hash: await bcrypt.hash('wrongPassword', 10),
        estado: true,
        roles: [],
      };

      jest
        .spyOn(usuarioRepository, 'findOne')
        .mockResolvedValue(usuarioMock as unknown as Usuario);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería lanzar una excepción si el usuario está inactivo', async () => {
      const loginDto: LoginDto = {
        correo: 'test@example.com',
        contrasena: 'password123',
      };

      const usuarioMock = {
        id: '1',
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena_hash: await bcrypt.hash('password123', 10),
        estado: false,
        roles: [],
      };

      jest
        .spyOn(usuarioRepository, 'findOne')
        .mockResolvedValue(usuarioMock as unknown as Usuario);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
