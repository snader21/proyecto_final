/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: { email: string; password: string }) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body()
    signUpDto: {
      nombre: string;
      correo: string;
      contrasena: string;
      roles: string[];
    },
  ) {
    return this.authService.signUp(signUpDto);
  }
}
