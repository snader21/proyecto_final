import { BadRequestException, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ProveedorAiService } from '../proveedor-ai/proveedor-ai.service';
import { generarPromptOptimizacionRutas } from './calculo-ruta.promt';
import { ProductosService } from '../productos/productos.service';
import { PedidosService } from '../pedidos/pedidos.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ClienteService } from '../clientes/services/cliente.service';
import { Cron } from '@nestjs/schedule';

export interface CreateNodoProductoDto {
  productoId: string;
  cantidad: number;
}

export interface CreateNodoRutaDto {
  numeroNodoProgramado: number;
  latitud: number;
  longitud: number;
  hora_llegada?: string;
  hora_salida?: string;
  id_bodega?: string | null;
  nombre_bodega?: string | null;
  id_cliente?: string | null;
  id_pedido?: string | null;
  productos: CreateNodoProductoDto[];
}

export interface RutaDto {
  duracionEstimada: number;
  fecha: string;
  distanciaTotal: number;
  camionId: string;
  nodos: CreateNodoRutaDto[];
}

export interface OptimizedRoutesResponse {
  camiones_insuficientes: boolean;
  rutas: RutaDto[];
}

@Injectable()
export class RutasService {
  constructor(
    private readonly aiProviderService: ProveedorAiService,
    private readonly clientesService: ClienteService,
    private readonly productosService: ProductosService,
    private readonly pedidosService: PedidosService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private obtenerCamiones() {
    const api = this.configService.get<string>('URL_RUTAS');
    const apiEndPoint = `${api}/camiones`;
    return this.httpService
      .get(apiEndPoint)
      .pipe(map((response) => response.data));
  }

  async calcularYGuardarRutaDeEntregaDePedidos() {
    try {
      const pedidosParaManiana = await firstValueFrom(
        this.pedidosService.obtenerPedidosRegistradosHoy(),
      );

      if (pedidosParaManiana.length === 0) {
        return 'No hay pedidos para mañana';
      }

      const camiones = await firstValueFrom(this.obtenerCamiones());

      const productosPorDespachar: any[] = [];

      for (const pedido of pedidosParaManiana) {
        const productos = await firstValueFrom(
          this.productosService.obtenerProductosDePedidosConfirmados(
            pedido.id_pedido,
          ),
        );

        if (productos && productos.length > 0) {
          const cliente = await this.clientesService.findOne(pedido.id_cliente);

          const productosFormateados = productos.map((producto) => {
            const volumen =
              producto.alto *
              producto.largo *
              producto.ancho *
              producto.cantidad;

            return {
              producto: {
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                volumen_total: volumen,
                cantidad: producto.cantidad,
                id_pedido: pedido.id_pedido,
              },
              cliente: {
                id_cliente: pedido.id_cliente,
                nombre: cliente.nombre,
                direccion: cliente.direccion,
                coordenadas_cliente: {
                  lat: cliente.lat,
                  lng: cliente.lng,
                },
              },
              bodega: {
                id_bodega: producto.id_bodega,
                nombre_bodega: producto.nombre_bodega,
                direccion: producto.direccion,
                coordenadas_bodega: {
                  lat: producto.latitud,
                  lng: producto.longitud,
                },
              },
            };
          });

          productosPorDespachar.push(productosFormateados);
        }
      }
      console.log(
        '🚀 ~ RutasService ~ calcularYGuardarRuta ~ productosPorDespachar:',
        JSON.stringify(productosPorDespachar, null, 2),
      );

      const rutas = await this.calcularRuta({
        productosPorDespachar,
        camiones,
      });

      if (rutas?.camiones_insuficientes) {
        throw new Error('No hay camiones suficientes');
      }

      if (rutas) {
        await firstValueFrom(this.actualizarRuta(rutas.rutas));
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async calcularRuta({
    productosPorDespachar,
    camiones,
  }: any): Promise<OptimizedRoutesResponse | null> {
    const prompt = generarPromptOptimizacionRutas({
      productosPorDespachar,
      camiones,
    });
    const respuesta = await this.aiProviderService.enviarPrompt(prompt);

    if (respuesta?.content) {
      try {
        const ruta: OptimizedRoutesResponse = JSON.parse(
          respuesta.content,
        ) as OptimizedRoutesResponse;
        return ruta;
      } catch (error) {
        throw new Error('Error parsing AI response: ' + error);
      }
    }
    return null;
  }

  actualizarRuta(createRutaDto: RutaDto[]) {
    console.log(
      '🚀 ~ RutasService ~ actualizarRuta ~ createRutaDto:',
      JSON.stringify(createRutaDto, null, 2),
    );
    const api = this.configService.get<string>('URL_RUTAS');
    const apiEndPoint = `${api}/rutas`;

    return this.httpService
      .post<any>(apiEndPoint, createRutaDto)
      .pipe(map((response) => response.data));
  }

  // // cron every 5 seconds
  // @Cron('*/5 * * * * *')
  obtenerListaRutas() {
    const api = this.configService.get<string>('URL_RUTAS');
    const apiEndPoint = `${api}/rutas`;
    return this.httpService
      .get(apiEndPoint)
      .pipe(map((response) => response.data));
  }
}
