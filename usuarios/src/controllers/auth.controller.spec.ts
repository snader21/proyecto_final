import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const mockLoginDto: LoginDto = {
      correo: 'test@example.com',
      contrasena: 'password123',
    };

    const mockUsuario: Usuario = {
      id: '1',
      nombre: 'Test User',
      correo: 'test@example.com',
      contrasena_hash: bcrypt.hashSync('password123', 10),
      estado: true,
      roles: [
        {
          id: '1',
          nombre: 'USER',
        } as Rol,
      ],
    } as Usuario;

    it('should successfully login and return token and user data', async () => {
      const expectedResponse = {
        token: 'mock.jwt.token',
        usuario: {
          id: mockUsuario.id,
          nombre: mockUsuario.nombre,
          correo: mockUsuario.correo,
          roles: mockUsuario.roles,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Credenciales inválidas'),
      );

      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Usuario inactivo'),
      );

      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should validate input data', async () => {
      const invalidLoginDto: LoginDto = {
        correo: 'invalid-email',
        contrasena: '123', // too short
      };

      await expect(controller.login(invalidLoginDto)).rejects.toThrow();
    });
  });
});
