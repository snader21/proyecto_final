import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TrimestresOrquestadorService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getTrimestresPorAno(ano: number) {
    try {
      const api = this.configService.get<string>('URL_VENDEDORES') || 'http://localhost:3000';
      const { data } = await firstValueFrom(this.httpService.get(`${api}/plan-ventas/trimestres/${ano}`));
      return data;
    } catch (error) {
      throw new HttpException('Error consultando trimestres en vendedores', 502);
    }
  }
}
