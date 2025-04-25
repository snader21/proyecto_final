/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateClienteDto } from '../dtos/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/update-cliente.dto';
import { GetClienteDto } from '../dtos/get-cliente.dto';

@Injectable()
export class ClienteService {
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

  async create(createClienteDto: CreateClienteDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.clientesApiUrl}/clientes`,
        createClienteDto,
      ),
    );
    return data;
  }

  async findAll(): Promise<GetClienteDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/clientes`),
    );
    return data;
  }

  async findByVendedorId(vendedorId: string | null) {
    const params = vendedorId !== null ? { vendedorId: vendedorId } : {};
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/clientes/vendedor`, {
        params: params,
      }),
    );

    return data; // 'data' contendrá el array de clientes devuelto por la API
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/clientes/${id}`),
    );
    return data;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const { data } = await firstValueFrom(
      this.httpService.put(
        `${this.clientesApiUrl}/clientes/${id}`,
        updateClienteDto,
      ),
    );
    return data;
  }

  async remove(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.clientesApiUrl}/clientes/${id}`),
    );
    return data;
  }

  async assignVendedorToCliente(id: string, id_vendedor: string | null) {
    const { data } = await firstValueFrom(
      this.httpService.put(`${this.clientesApiUrl}/clientes/${id}/vendedor`, {
        id_vendedor,
      }),
    );
    return data;
  }
}
