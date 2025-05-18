/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface Permission {
  id: string;
  nombre: string;
  modulo: string;
}

interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  contrasena: string;
  roles?: string[];
  estado?: 'active' | 'inactive';
}

interface LoginDto {
  correo: string;
  contrasena: string;
}

interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    correo: string;
    roles: string[];
    estado: string;
    permisos: Permission[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async signIn(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const usersServiceUrl = this.configService.get<string>('URL_USUARIOS');

      const response = await firstValueFrom(
        this.httpService.post<AuthResponse>(
          `${usersServiceUrl}/auth/login`,
          loginDto,
        ),
      );

      if (response.data.token) {
        // Asegurarnos de que los permisos estén incluidos en el token
        const tokenPayload = await this.jwtService.verifyAsync(
          response.data.token,
        );
        const { exp, iat, ...payloadWithoutExp } = tokenPayload;
        const newToken = await this.jwtService.signAsync({
          ...payloadWithoutExp,
          permisos: response.data.usuario.permisos || [],
        });

        return {
          ...response.data,
          token: newToken,
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new BadRequestException('Authentication failed');
    }
  }

  async signUp(userData: CreateUsuarioDto): Promise<AuthResponse> {
    try {
      const usersServiceUrl = this.configService.get<string>('URL_USUARIOS');
      const response = await firstValueFrom(
        this.httpService.post<AuthResponse>(`${usersServiceUrl}/usuarios`, {
          ...userData,
          estado: userData.estado || 'active',
        }),
      );

      // Asegurarnos de que los permisos estén incluidos en el token
      if (response.data.token) {
        const tokenPayload = await this.jwtService.verifyAsync(
          response.data.token,
        );
        const { exp, iat, ...payloadWithoutExp } = tokenPayload;
        const newToken = await this.jwtService.signAsync({
          ...payloadWithoutExp,
          permisos: response.data.usuario.permisos || [],
        });

        return {
          ...response.data,
          token: newToken,
        };
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new BadRequestException(
          error.response.data.message || 'Invalid user data',
        );
      }
      console.error('Error during signUp:', error);
      throw new BadRequestException('Registration failed');
    }
  }
}
