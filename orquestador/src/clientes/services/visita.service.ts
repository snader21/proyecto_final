/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VisitaService {
  private readonly clientesApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiUrl = this.configService.get<string>('URL_CLIENTES');
    if (!apiUrl) {
      throw new Error('URL_CLIENTES environment variable is not defined');
    }
    this.clientesApiUrl = apiUrl;
  }

  async registrarVisita(formData: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.clientesApiUrl}/visitas`, formData, {
        headers: formData.getHeaders?.() ?? {},
      }),
    );
    return data;
  }

  async obtenerVisitasCliente(id_cliente: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.clientesApiUrl}/visitas/cliente/${id_cliente}`,
      ),
    );
    return data;
  }

  async obtenerUrlVideo(video_key: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/visitas/video/${video_key}`),
    );
    return data;
  }
}
