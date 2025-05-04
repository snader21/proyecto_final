/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async crearUsuario(usuario: any) {
    const api = this.configService.get<string>('URL_USUARIOS');
    const { data } = await firstValueFrom(
      this.httpService.post(`${api}/usuarios`, usuario),
    );
    return data;
  }

  async obtenerUsuarios() {
    const api = this.configService.get<string>('URL_USUARIOS');
    const { data } = await firstValueFrom(
      this.httpService.get(`${api}/usuarios`),
    );
    return data;
  }

  async obtenerUsuarioPorId(id: string) {
    const api = this.configService.get<string>('URL_USUARIOS');
    const { data } = await firstValueFrom(
      this.httpService.get(`${api}/usuarios/${id}`),
    );
    return data;
  }

  async eliminarUsuario(id: string) {
    const api = this.configService.get<string>('URL_USUARIOS');
    const { data } = await firstValueFrom(
      this.httpService.delete(`${api}/usuarios/${id}`),
    );
    return data;
  }

  async obtenerRoles() {
    const api = this.configService.get<string>('URL_USUARIOS');
    const { data } = await firstValueFrom(this.httpService.get(`${api}/roles`));
    return data;
  }

  async actualizarUsuario(id: string, usuario: any) {
    const api = this.configService.get<string>('URL_USUARIOS');
    const { data } = await firstValueFrom(
      this.httpService.put(`${api}/usuarios/${id}`, usuario),
    );
    return data;
  }
}
