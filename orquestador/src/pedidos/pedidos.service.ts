import { Injectable } from '@nestjs/common';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export interface IRespuestaPedido {
  id_pedido: string;
  id_vendedor: string;
  fecha_registro: string;
  id_estado: number;
  descripcion: string;
  id_cliente: string;
  id_metodo_pago: string;
  estado_pago: string;
  costo_envio: number;
  id_metodo_envio: string;
  estado: {
    id_estado: number;
    nombre: string;
    descripcion: string;
  };
  pago: {
    id_metodo_pago: string;
    nombre: string;
  };
  envio: {
    id_metodo_envio: string;
    nombre: string;
  };
}

@Injectable()
export class PedidosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  obtenerPedidosRegistradosHoy(): Observable<IRespuestaPedido[]> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/pedidos`;

    return this.httpService.get<IRespuestaPedido[]>(apiEndPoint).pipe(
      map((respuesta) => respuesta.data),
      map((pedidos) =>
        pedidos.filter((pedido) => {
          const hoy = new Date().toISOString().split('T')[0];
          const fechaPedido = pedido.fecha_registro.split('T')[0];
          return fechaPedido === hoy;
        }),
      ),
    );
  }

  crearPedido(dto: any): Observable<IRespuestaPedido> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/pedidos`;
    return this.httpService
      .post<IRespuestaPedido>(apiEndPoint, dto)
      .pipe(map((res) => res.data));
  }

  findByIdVendedor(idVendedor: string, params?: { numeroPedido?: string; estado?: number; fechaInicio?: string; fechaFin?: string }): Observable<IRespuestaPedido[]> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    let apiEndPoint = `${api}/pedidos/vendedor/${idVendedor}`;

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.numeroPedido) queryParams.append('numeroPedido', params.numeroPedido);
      if (params.estado) queryParams.append('estado', params.estado.toString());
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (queryParams.toString()) {
        apiEndPoint += `?${queryParams.toString()}`;
      }
    }

    return this.httpService.get<IRespuestaPedido[]>(apiEndPoint).pipe(map((res) => res.data));
  }

  findByIdCliente(idCliente: string, params?: { numeroPedido?: string; estado?: number; fechaInicio?: string; fechaFin?: string }): Observable<IRespuestaPedido[]> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    let apiEndPoint = `${api}/pedidos/cliente/${idCliente}`;

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.numeroPedido) queryParams.append('numeroPedido', params.numeroPedido);
      if (params.estado) queryParams.append('estado', params.estado.toString());
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (queryParams.toString()) {
        apiEndPoint += `?${queryParams.toString()}`;
      }
    }

    return this.httpService.get<IRespuestaPedido[]>(apiEndPoint).pipe(map((res) => res.data));
  }

  findAll(params?: { numeroPedido?: string; estado?: number; fechaInicio?: string; fechaFin?: string }): Observable<IRespuestaPedido[]> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    let apiEndPoint = `${api}/pedidos`;

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.numeroPedido) queryParams.append('numeroPedido', params.numeroPedido);
      if (params.estado) queryParams.append('estado', params.estado.toString());
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (queryParams.toString()) {
        apiEndPoint += `?${queryParams.toString()}`;
      }
      console.log(apiEndPoint);
    }

    return this.httpService.get<IRespuestaPedido[]>(apiEndPoint).pipe(map((res) => res.data));
  }

  findAllEstadoPedido(): Observable<IRespuestaPedido[]> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/pedidos/estado-pedido`;
    return this.httpService.get<IRespuestaPedido[]>(apiEndPoint).pipe(map((res) => res.data));
  }
}
