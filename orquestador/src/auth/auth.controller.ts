/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

interface LoginDto {
  correo: string;
  contrasena: string;
}

interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  contrasena: string;
  roles?: string[];
  estado?: 'active' | 'inactive';
}

interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    correo: string;
    roles: string[];
    estado: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: CreateUsuarioDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }
}
