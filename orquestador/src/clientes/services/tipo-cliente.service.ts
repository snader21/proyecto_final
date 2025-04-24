import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetTipoClienteDto } from '../dtos/get-tipo-cliente.dto';

@Injectable()
export class TipoClienteService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<GetTipoClienteDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<GetTipoClienteDto[]>('/tipos-cliente'),
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
