import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

interface IRespuestaApi {
  id: number;
}

interface IRespuestaApi2 {
  userId: number;
}

interface IRespuestaApi3 {
  lng: number;
  lat: number;
}

@Injectable()
export class RutasService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // @Cron('*/10 * * * * *')
  calcularYGuardarRuta() {
    this.obtenerProductosParaManiana()
      .pipe(
        tap((respuesta1) => console.log('Pedidos obtenidos', respuesta1)),

        switchMap(this.obtenerProductosDePedidos.bind(this)),
        tap((respuesta2) => console.log('Productos obtenidos', respuesta2)),

        switchMap(this.calcularRuta.bind(this)),
        tap((respuesta3) => console.log('Ruta calculada', respuesta3)),

        switchMap(this.actualizarRuta.bind(this)),
        tap(() => console.log('Ruta actualizada con éxito')),

        catchError((error) => {
          console.error('Error en la cadena de observables:', error);
          return of(null);
        }),
      )
      .subscribe();
  }

  obtenerProductosParaManiana(): Observable<IRespuestaApi> {
    const api = this.configService.get<string>('URL_PEDIDOS');
    const apiEndPoint = `${api}/1`;

    return this.httpService
      .get<IRespuestaApi>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  obtenerProductosDePedidos(id: number): Observable<IRespuestaApi2> {
    const api = this.configService.get<string>('URL_PRODUCTOS');
    const apiEndPoint = `${api}${id}`;

    return this.httpService
      .get<IRespuestaApi2>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  calcularRuta(userId: number): Observable<IRespuestaApi3> {
    const api = this.configService.get<string>('URL_DEEPSEEK');
    const apiEndPoint = `${api}${userId}`;

    return this.httpService
      .get<IRespuestaApi3>(apiEndPoint)
      .pipe(map(() => ({ lng: 10, lat: 15 })));
  }

  actualizarRuta(ruta: IRespuestaApi3): Observable<null> {
    console.log('Actualizando ruta:', ruta);
    return of(null);
  }
}
