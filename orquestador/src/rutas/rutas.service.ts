import { Injectable } from '@nestjs/common';
import {
  tap,
  catchError,
  concatMap,
  map,
  filter,
  toArray,
  switchMap,
} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ProveedorAiService } from '../proveedor-ai/proveedor-ai.service';
import { generarPromptOptimizacionRutas } from './calculo-ruta.promt';
import {
  IRespuestaProducto,
  ProductosService,
} from '../productos/productos.service';
import { IRespuestaPedido, PedidosService } from '../pedidos/pedidos.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

export interface IPoint {
  lat: number;
  lng: number;
}

interface IPedidoTransformado {
  id: string;
  lat: number;
  lng: number;
  productos: {
    id: string;
    volumen: number;
  }[];
}

export interface IDatosRuta {
  departure: IPoint;
  orders: IPedidoTransformado[];
  truckCapacity: number;
}

export interface CreateNodoProductoDto {
  productoId: number;
  pedidoId: string;
}

export interface CreateNodoRutaDto {
  numeroNodoProgramado: number;
  latitud: number;
  longitud: number;
  productos: CreateNodoProductoDto[];
}

export interface CreateRutaDto {
  fecha: string;
  duracionEstimada: number;
  distanciaTotal: number;
  tipoRutaId: number;
  camionId: number;
  nodos: CreateNodoRutaDto[];
}

@Injectable()
export class RutasService {
  constructor(
    private readonly aiProviderService: ProveedorAiService,
    private readonly productosService: ProductosService,
    private readonly pedidosService: PedidosService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  calcularYGuardarRuta() {
    const capacidadCamion = 10000000;
    const puntoPartida = {
      lat: 19.4326,
      lng: -99.1332,
    };

    return this.pedidosService.obtenerPedidosParaManiana().pipe(
      tap(() => console.log('Pedidos obtenidos')),
      concatMap((pedidos: IRespuestaPedido[]) => from(pedidos)),
      concatMap((pedido) =>
        this.productosService
          .obtenerProductosDePedidos(pedido.id_pedido)
          .pipe(
            map((productos: IRespuestaProducto[]) => ({ pedido, productos })),
          ),
      ),
      tap(() => console.log('Productos obtenidos')),
      filter(({ productos }) => productos && productos.length > 0),
      map(({ pedido, productos }) => {
        const lat = this.generarCoordenadaAleatoria(19.0, 20.0);
        const lng = this.generarCoordenadaAleatoria(-99.5, -98.5);

        const productosFormateados = productos.map((producto) => {
          const volumen =
            producto.alto * producto.largo * producto.ancho * producto.cantidad;

          return {
            id: producto.id_producto,
            volumen: volumen,
          };
        });

        return {
          id: pedido.id_pedido,
          lat,
          lng,
          productos: productosFormateados,
        };
      }),
      toArray(),
      map((pedidosTransformados) => {
        const datosRuta: IDatosRuta = {
          departure: puntoPartida,
          orders: pedidosTransformados,
          truckCapacity: capacidadCamion,
        };
        return datosRuta;
      }),
      tap(() => console.log('Calculando ruta')),
      switchMap(this.calcularRuta.bind(this)),
      tap(() => console.log('Ruta calculada. Se procederá a guardarla')),
      switchMap(this.actualizarRuta.bind(this)),
      tap(() => console.log('Ruta guardada')),

      catchError((error) => {
        console.error('Error en la cadena de observables:', error);
        return of(null);
      }),
    );
  }

  private generarCoordenadaAleatoria(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  async calcularRuta({
    departure,
    orders,
    truckCapacity,
  }: IDatosRuta): Promise<CreateRutaDto | null> {
    const prompt = generarPromptOptimizacionRutas({
      departure,
      orders,
      truckCapacity,
    });
    const respuesta = await this.aiProviderService.enviarPrompt(prompt);
    console.log('🚀 ~ RutasService ~ respuesta:', respuesta);

    if (respuesta?.content) {
      try {
        const ruta: CreateRutaDto = JSON.parse(
          respuesta.content,
        ) as CreateRutaDto;
        return ruta;
      } catch (error) {
        throw new Error('Error parsing AI response: ' + error);
      }
    }
    return null;
  }

  actualizarRuta(createRutaDto: CreateRutaDto) {
    const api = this.configService.get<string>('URL_RUTAS');
    const apiEndPoint = `${api}/rutas`;

    return this.httpService
      .post<CreateRutaDto>(apiEndPoint, createRutaDto)
      .pipe(map((response) => response.data));
  }
}
