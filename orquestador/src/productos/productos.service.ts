import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface IRespuestaApi {
  id: number;
}

@Injectable()
export class ProductosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  obtenerProductosParaManiana(): Observable<IRespuestaApi> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/1`;

    return this.httpService
      .get<IRespuestaApi>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }
}
