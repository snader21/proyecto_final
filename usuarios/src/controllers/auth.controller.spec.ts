import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              token: 'mockToken',
              usuario: {
                id: '1',
                nombre: 'Test User',
                correo: 'test@example.com',
              },
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('debería retornar un token y datos del usuario', async () => {
      const loginDto: LoginDto = {
        correo: 'test@example.com',
        contrasena: 'password123',
      };

      const result = await authController.login(loginDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
      expect(result.token).toBe('mockToken');
      expect(result.usuario.correo).toBe('test@example.com');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
