/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class FabricantesService {
  private readonly fabricantesServiceUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.fabricantesServiceUrl =
      this.configService.get<string>('URL_FABRICANTES') || '';
  }
  async getFabricante(id: string) {
    console.log(id);
    const response = await firstValueFrom(
      this.httpService.get(`${this.fabricantesServiceUrl}/fabricantes/${id}`),
    );
    return response.data;
  }
  async getFabricantes() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.fabricantesServiceUrl}/fabricantes`),
    );
    return response.data;
  }
  async createFabricante(fabricante: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.fabricantesServiceUrl}/fabricantes`,
          fabricante,
        ),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new BadRequestException(
        'Se produjo un error al crear el fabricante: ' +
          axiosError?.response?.data?.message,
      );
    }
  }
  async updateFabricante(id: string, fabricante: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.fabricantesServiceUrl}/fabricantes/${id}`,
          fabricante,
        ),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new BadRequestException(
        'Se produjo un error al actualizar el fabricante: ' +
          axiosError?.response?.data?.message,
      );
    }
  }

  async getCiudades() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.fabricantesServiceUrl}/lugares/ciudades`),
    );
    return response.data;
  }

  async getPaises() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.fabricantesServiceUrl}/lugares/paises`),
    );
    return response.data;
  }

  async getCiudadesByPais(pais: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.fabricantesServiceUrl}/lugares/paises/${pais}/ciudades/`,
      ),
    );
    return response.data;
  }
}
