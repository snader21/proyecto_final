// ignore ts warnings
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReportsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  //cron every 10 seconds
  // @Cron('*/10 * * * * *')
  async reporteVentasETL() {
    const data = await this.extractReporteVentas();
    const transformedData = this.transformReporteVentas(data);
    await this.loadReporteVentas(transformedData);
  }

  async extractReporteVentas() {
    const vendedoresApi = this.configService.get<string>('URL_VENDEDORES');
    const vendedoresEndPoint = `${vendedoresApi}/vendedores`;
    const planesVentasEndPoint = `${vendedoresApi}/plan-ventas`;

    const clientesApi = this.configService.get<string>('URL_CLIENTES');
    const clientesEndPoint = `${clientesApi}/clientes`;

    const pedidosApi = this.configService.get<string>('URL_PEDIDOS');
    const pedidosEndPoint = `${pedidosApi}/pedidos`;

    const productosApi = this.configService.get<string>('URL_PRODUCTOS');
    const productosEndPoint = `${productosApi}/productos`;
    const pedidosProductosEndPoint = `${productosApi}/productos/con-pedidos`;

    const { data: vendedores } = await firstValueFrom(
      this.httpService.get(vendedoresEndPoint),
    );

    const { data: planesVentas } = await firstValueFrom(
      this.httpService.get(planesVentasEndPoint),
    );

    const { data: clientes } = await firstValueFrom(
      this.httpService.get(clientesEndPoint),
    );

    const { data: pedidos } = await firstValueFrom(
      this.httpService.get(pedidosEndPoint),
    );

    const { data: productos } = await firstValueFrom(
      this.httpService.get(productosEndPoint),
    );

    const { data: pedidosProductos } = await firstValueFrom(
      this.httpService.get(pedidosProductosEndPoint),
    );

    return {
      vendedores,
      planesVentas,
      clientes,
      pedidos,
      productos,
      pedidosProductos,
    };
  }

  transformReporteVentas(data: any) {
    const transformedData: any[] = [];

    for (const pedido of data.pedidos) {
      console.log(
        '🚀 ~ ReportsService ~ transformReporteVentas ~ pedido:',
        pedido,
      );
      const cliente: any = data.clientes.find(
        (cliente: any) => cliente.id_cliente === pedido.id_cliente,
      );
      const vendedor: any = data.vendedores.find(
        (vendedor: any) => vendedor.id_vendedor === pedido.id_vendedor,
      );
      const productos: any[] = data.pedidosProductos.filter(
        (producto: any) => producto.id_pedido === pedido.id_pedido,
      );

      for (const producto of productos) {
        transformedData.push({
          id_cliente: cliente?.id_cliente,
          nombre_cliente: cliente?.nombre,
          id_vendedor: vendedor?.id_vendedor,
          nombre_vendedor: vendedor?.nombre,
          id_producto: producto?.id_producto,
          nombre_producto: producto?.nombre,
          cantidad: producto?.cantidad,
          fecha: pedido?.fecha_registro,
          estado: pedido?.estado.nombre,
          subtotal: producto?.precio * producto?.cantidad,
        });
      }
    }
    console.log(
      '🚀 ~ ReportsService ~ transformReporteVentas ~ transformedData:',
      transformedData,
    );
    return transformedData;
  }

  async loadReporteVentas(transformedData: any[]) {}
}
