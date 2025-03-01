import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface IRespuestaProducto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  sku: string;
  precio: number;
  alto: number;
  largo: number;
  ancho: number;
  peso: number;
  cantidad: number;
}

@Injectable()
export class ProductosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  obtenerProductosDePedidos(id: string): Observable<IRespuestaProducto[]> {
    const api = this.configService.get<string>('URL_PRODUCTOS');
    const apiEndPoint = `${api}/productos/${id}`;

    return this.httpService
      .get<IRespuestaProducto[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }
}
