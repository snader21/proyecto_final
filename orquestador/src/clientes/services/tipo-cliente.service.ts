import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetTipoClienteDto } from '../dtos/get-tipo-cliente.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TipoClienteService {
  private readonly clientesApiUrl: string | undefined;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiUrl = this.configService.get<string>('URL_CLIENTES');
    this.clientesApiUrl = apiUrl;
  }

  async findAll(): Promise<GetTipoClienteDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<GetTipoClienteDto[]>(
        `${this.clientesApiUrl}/tipos-cliente`,
      ),
    );
    return data;
  }

  async findOne(id: string): Promise<GetTipoClienteDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<GetTipoClienteDto>(`/tipos-cliente/${id}`),
    );
    return data;
  }
}
