import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuarioRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    const mockToken = 'mock.jwt.token';

    it('should successfully login and return token and user data', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(mockUsuario);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockLoginDto);

      expect(result).toEqual({
        token: mockToken,
        usuario: {
          id: mockUsuario.id,
          nombre: mockUsuario.nombre,
          correo: mockUsuario.correo,
          roles: mockUsuario.roles,
        },
      });
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { correo: mockLoginDto.correo },
        relations: ['roles'],
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUsuario.id,
        correo: mockUsuario.correo,
        roles: ['USER'],
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { correo: mockLoginDto.correo },
        relations: ['roles'],
      });
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const usuarioWithWrongPassword = {
        ...mockUsuario,
        contrasena_hash: bcrypt.hashSync('wrongpassword', 10),
      };
      mockUsuarioRepository.findOne.mockResolvedValue(usuarioWithWrongPassword);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { correo: mockLoginDto.correo },
        relations: ['roles'],
      });
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const inactiveUsuario = {
        ...mockUsuario,
        estado: false,
      };
      mockUsuarioRepository.findOne.mockResolvedValue(inactiveUsuario);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { correo: mockLoginDto.correo },
        relations: ['roles'],
      });
    });
  });
});
