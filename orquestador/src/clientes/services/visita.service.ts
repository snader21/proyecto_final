import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateVisitaDto } from '../dtos/create-visita.dto';

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

  async registrarVisita(createVisitaDto: CreateVisitaDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.clientesApiUrl}/visitas`, createVisitaDto),
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

  async obtenerTodosLosClientesConUltimaVisita(): Promise<
    {
      id_cliente: string;
      id_vendedor: string | null;
      ultima_visita: Date | null;
    }[]
  > {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/visitas/ultima-visita`),
    );
    return data;
  }
}
