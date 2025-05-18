import { BadRequestException, Injectable } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ProveedorAiService } from '../proveedor-ai/proveedor-ai.service';
import { generarPromptOptimizacionRutas } from './calculo-ruta-entregas.promt';
import { ProductosService } from '../productos/productos.service';
import { PedidosService } from '../pedidos/pedidos.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ClienteService } from '../clientes/services/cliente.service';
import { VisitaService } from 'src/clientes/services/visita.service';
import { generarPromptGeneracionRutaVisitaVendedores } from './calculo-ruta-visitas.promt';
import { RutaEntity } from '../../../rutas/src/rutas/entities/ruta.entity';

interface NodoVisita {
  numeroNodoProgramado: number;
  latitud: number;
  longitud: number;
  direccion: string | null;
  hora_llegada: string;
  hora_salida: string;
  id_bodega: string | null;
  id_cliente: string;
  id_pedido: string | null;
  productos: null;
}

interface VisitaProgramada {
  duracionEstimada: number;
  fecha: string;
  distanciaTotal: number;
  camionId: string | null;
  nodos: NodoVisita[];
}

interface VendedorVisitas {
  id_vendedor: string;
  visitas_programadas: VisitaProgramada[];
}

interface RutaVisitaVendedores {
  vendedores: VendedorVisitas[];
}

export interface CreateNodoProductoDto {
  productoId: string;
  cantidad: number;
}

export interface VisitasVendedoresResponse {
  vendedores: Array<{
    id_vendedor: string;
    visitas_programadas: Array<{
      duracionEstimada: number;
      fecha: string;
      distanciaTotal: number;
      camionId: string | null;
      nodos: Array<{
        numeroNodoProgramado: number;
        latitud: number;
        longitud: number;
        direccion: string | null;
        hora_llegada: string;
        hora_salida: string;
        id_bodega: string | null;
        id_cliente: string;
        id_pedido: string | null;
        productos: Array<{
          productoId: string;
          cantidad: number;
        }> | null;
      }>;
    }>;
  }>;
}

export interface RutasEntregaResponse {
  camiones_insuficientes: boolean;
  rutas: RutaDto[];
}

export type OptimizedRoutesResponse = VisitasVendedoresResponse | RutasEntregaResponse;

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
    private readonly visitaService: VisitaService,
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

  async calcularYGuardarRutaDeVisitaDeVendedores() {
    try {
      // 1. Consultar los clientes obtenerTodosLosClientesConUltimaVisita()
      const clientesConUltimaVisita =
        await this.visitaService.obtenerTodosLosClientesConUltimaVisita();

      // 2. Generara un prompt para el AI con los clientes que en base a la ultima visita genere la ruta del vendedor
      const prompt = generarPromptGeneracionRutaVisitaVendedores({
        vendedores: clientesConUltimaVisita,
      });

      // 3. Persistir en la base de datos la ruta del vendedor para hacer la visita
      const respuesta = await this.aiProviderService.enviarPrompt(prompt);
      console.log('🚀 ~ Respuesta de IA:', respuesta);

      if (respuesta?.content) {
        try {
          const rutaResponse = JSON.parse(respuesta.content) as VisitasVendedoresResponse;

          console.log('Rutas generadas:', JSON.stringify(rutaResponse, null, 2));

          // Redondear distanciaTotal a entero
          rutaResponse.vendedores.forEach((vendedor) => {
            vendedor.visitas_programadas.forEach((visita) => {
              if (typeof visita.distanciaTotal === 'number') {
                visita.distanciaTotal = Math.round(visita.distanciaTotal);
              }
            });
          });

          // 4. Guardar las rutas en la base de datos
          if (rutaResponse.vendedores) {
            for (const vendedor of rutaResponse.vendedores) {
              for (const visita of vendedor.visitas_programadas) {
                const rutaData = {
                  fecha: visita.fecha,
                  duracionEstimada: visita.duracionEstimada,
                  distanciaTotal: visita.distanciaTotal,
                  vendedor_id: vendedor.id_vendedor,
                  tipo_ruta: 'visita' as const,
                  nodos: visita.nodos.map((nodo) => ({
                    numeroNodoProgramado: nodo.numeroNodoProgramado,
                    latitud: nodo.latitud,
                    longitud: nodo.longitud,
                    hora_llegada: nodo.hora_llegada,
                    hora_salida: nodo.hora_salida,
                    id_bodega: null,
                    id_cliente: nodo.id_cliente,
                    id_pedido: null
                  }))
                };

                const api = this.configService.get<string>('URL_RUTAS');
                if (!api) {
                  throw new Error('URL_RUTAS no está configurada');
                }

                const apiEndPoint = `${api}/rutas/ruta-visita-vendedores`;
                console.log('URL del servicio:', apiEndPoint);

                await firstValueFrom(
                  this.httpService
                    .post<RutaEntity>(
                      apiEndPoint,
                      [rutaData]
                    )
                    .pipe(
                      map((response) => {
                        console.log('Respuesta del servidor:');
                        console.log('Status:', response.status, response.statusText);
                        console.log('Body:', JSON.stringify(response.data, null, 2));
                        return response.data[0];
                      }),
                      catchError((error: any) => {
                        console.error('Error al llamar al servicio:', error.response?.data);
                        console.error('URL usada:', apiEndPoint);
                        console.error('Datos enviados:', JSON.stringify(rutaData, null, 2));
                        throw new BadRequestException(
                          error.response?.data?.message || 'Error al crear la ruta en el servicio'
                        );
                      }),
                    ),
                );
              }
            }
          }

          return rutaResponse;
        } catch (error) {
          console.error('Error general:', error);
          throw new BadRequestException(
            error instanceof Error ? error.message : 'Error al procesar la ruta'
          );
        }
      }
      return null;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async calcularRuta({
    productosPorDespachar,
    camiones,
  }: {
    productosPorDespachar: any[];
    camiones: any[];
  }): Promise<RutasEntregaResponse | null> {
    const prompt = generarPromptOptimizacionRutas({
      productosPorDespachar,
      camiones,
    });
    const respuesta = await this.aiProviderService.enviarPrompt(prompt);

    if (respuesta?.content) {
      try {
        const ruta = JSON.parse(respuesta.content) as RutasEntregaResponse;
        return ruta;
      } catch (error) {
        throw new Error('Error parsing AI response: ' + (error as Error).message);
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
    const apiEndPoint = `${api}/rutas/ruta-entrega-de-pedidos`;

    return this.httpService
      .post<RutaEntity[]>(apiEndPoint, createRutaDto)
      .pipe(map((response) => response.data));
  }

  // // cron every 5 seconds
  // @Cron('*/5 * * * * *')
  obtenerListaRutas(tipoRuta: string) {
    const api = this.configService.get<string>('URL_RUTAS');
    const apiEndPoint = `${api}/rutas?tipoRuta=${tipoRuta}`;
    return this.httpService
      .get(apiEndPoint)
      .pipe(map((response) => response.data));
  }
}
