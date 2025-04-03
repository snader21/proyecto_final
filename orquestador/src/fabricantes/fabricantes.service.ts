/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.fabricantesServiceUrl}/fabricantes`,
        fabricante,
      ),
    );
    return response.data;
  }
  async updateFabricante(id: string, fabricante: any) {
    const response = await firstValueFrom(
      this.httpService.put(
        `${this.fabricantesServiceUrl}/fabricantes/${id}`,
        fabricante,
      ),
    );
    return response.data;
  }
  async deleteFabricante(id: string) {
    const response = await firstValueFrom(
      this.httpService.delete(
        `${this.fabricantesServiceUrl}/fabricantes/${id}`,
      ),
    );
    return response.data;
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
