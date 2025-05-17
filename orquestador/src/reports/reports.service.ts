// ignore ts warnings
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BigQueryService } from './bigquery-service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReportsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly bigQueryService: BigQueryService,
  ) {}

  //cron every 10 seconds
  // @Cron('*/10 * * * * *')
  async reporteVentasETL() {
    try {
      console.log('Iniciando proceso ETL de reporteVentas');
      console.log('Extrayendo datos de las APIs');
      const data = await this.extractReporteVentas();
      console.log('Transformando datos');
      const transformedData = this.transformReporteVentas(data);
      console.log('Cargando datos en BigQuery');
      await this.loadReporteVentas(transformedData);
      console.log('Proceso ETL de reporteVentas finalizado');
    } catch (error) {
      console.error('Error en el proceso ETL de reporteVentas:', error);
    }
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
      const cliente: any = data.clientes.find(
        (cliente: any) => cliente.id_cliente === pedido.id_cliente,
      );
      const vendedor: any = data.vendedores.find(
        (vendedor: any) => vendedor.id === pedido.id_vendedor,
      );
      const productos: any[] = data.pedidosProductos.filter(
        (producto: any) => producto.id_pedido === pedido.id_pedido,
      );

      for (const producto of productos) {
        transformedData.push({
          id_cliente: cliente?.id_cliente,
          nombre_cliente: cliente?.nombre,
          id_vendedor: vendedor?.id ?? 'Sin vendedor',
          nombre_vendedor: vendedor?.nombre ?? 'Sin vendedor',
          id_producto: producto?.id_producto,
          nombre_producto: producto?.nombre,
          id_categoria: producto?.id_categoria,
          categoria_producto: producto?.nombre_categoria,
          cantidad: producto?.cantidad,
          fecha: pedido?.fecha_registro,
          estado: pedido?.estado.nombre,
          subtotal_pedido: producto?.precio * producto?.cantidad,
          meta_vendedor: null,
          tipo_registro: 'venta',
        });
      }
    }

    for (const vendedor of data.vendedores) {
      const planVenta: any = data.planesVentas.find(
        (planVenta: any) => planVenta.idVendedor === vendedor.id,
      );

      const fechaMap = {
        Q1: new Date('2025-03-31'),
        Q2: new Date('2025-06-30'),
        Q3: new Date('2025-09-30'),
        Q4: new Date('2025-12-31'),
      };
      for (const meta of planVenta.metas) {
        transformedData.push({
          id_cliente: null,
          nombre_cliente: null,
          id_vendedor: vendedor.id,
          nombre_vendedor: vendedor.nombre,
          id_producto: null,
          nombre_producto: null,
          id_categoria: null,
          categoria_producto: null,
          cantidad: null,
          fecha: fechaMap[meta.idQ].toISOString().split('T')[0],
          estado: null,
          subtotal_pedido: null,
          meta_vendedor: meta.metaVenta,
          tipo_registro: 'meta',
        });
      }
    }

    console.log(
      '🚀 ~ ReportsService ~ transformReporteVentas ~ transformedData:',
      transformedData,
    );

    return transformedData;
  }

  async loadReporteVentas(transformedData: any[]) {
    const datasetId =
      this.configService.get<string>('GCP_BIGQUERY_DATASET_ID') || 'reportes';
    const tableId =
      this.configService.get<string>('GCP_BIGQUERY_TABLE_ID') || 'hecho_venta';
    const success = await this.bigQueryService.loadData(
      transformedData,
      datasetId,
      tableId,
    );
    if (!success) {
      throw new Error('Error al cargar datos en BigQuery');
    }
  }
}
