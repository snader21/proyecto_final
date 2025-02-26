import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

interface IRespuestaApi2 {
  userId: number;
}

@Injectable()
export class PedidosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  obtenerProductosDePedidos(id: number): Observable<IRespuestaApi2> {
    const api = this.configService.get<string>('URL_PRODUCTOS');
    const apiEndPoint = `${api}${id}`;

    return this.httpService
      .get<IRespuestaApi2>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }
}
