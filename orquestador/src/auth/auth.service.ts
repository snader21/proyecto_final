/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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

  async signIn(correo: string, contrasena: string) {
    try {
      const usersServiceUrl = this.configService.get<string>('URL_USUARIOS');
      const response = await firstValueFrom(
        this.httpService.post(`${usersServiceUrl}/auth/login`, {
          correo,
          contrasena,
        }),
      );

      if (response.data.token) {
        return response.data;
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      console.error('Error during signIn:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async signUp(userData: {
    nombre: string;
    correo: string;
    contrasena: string;
    roles: string[];
  }) {
    try {
      const usersServiceUrl = this.configService.get<string>('URL_USUARIOS');
      const response = await firstValueFrom(
        this.httpService.post(`${usersServiceUrl}/usuarios`, {
          ...userData,
          estado: true,
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error during signUp:', error);
      throw new UnauthorizedException('Registration failed');
    }
  }
}
