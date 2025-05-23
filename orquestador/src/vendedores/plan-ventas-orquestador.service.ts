import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlanVentasOrquestadorService {
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

  async getPlanVentas(idVendedor: string, ano: number) {
    try {
      const api = this.configService.get<string>('URL_VENDEDORES') || 'http://localhost:3000';
      const { data } = await firstValueFrom(this.httpService.get(`${api}/plan-ventas/${idVendedor}/${ano}`));
      return data;
    } catch (error) {
      throw new HttpException('Error consultando planes de venta en vendedores', 502);
    }
  }

  async createOrUpdatePlanVentas(planVentasDto: any) {
    try {
      const api = this.configService.get<string>('URL_VENDEDORES') || 'http://localhost:3000';
      const { data } = await firstValueFrom(this.httpService.put(`${api}/plan-ventas`, planVentasDto));
      return data;
    } catch (error) {
      throw new HttpException('Error actualizando plan de ventas en vendedores', 502);
    }
  }
}
