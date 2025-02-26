import { Injectable } from '@nestjs/common';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ProveedorAiService } from 'src/proveedor-ai/ai-provider.service';
import { generarPromptOptimizacionRutas } from './calculo-ruta.promt';
import { ProductosService } from 'src/productos/productos.service';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { Cron } from '@nestjs/schedule';

interface IRespuestaApi3 {
  lng: number;
  lat: number;
}

@Injectable()
export class RutasService {
  constructor(
    private readonly aiProviderService: ProveedorAiService,
    private readonly productosService: ProductosService,
    private readonly pedidosService: PedidosService,
  ) {}

  // @Cron('*/10 * * * * *')
  calcularYGuardarRuta() {
    this.productosService
      .obtenerProductosParaManiana()
      .pipe(
        tap((respuesta1) => console.log('Pedidos obtenidos', respuesta1)),

        switchMap(
          this.pedidosService.obtenerProductosDePedidos.bind(
            this.pedidosService,
          ),
        ),
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

  promptEnviado = false;
  // @Cron('*/20 * * * * *')
  async calcularRuta() {
    if (this.promptEnviado) return;
    this.promptEnviado = true;
    try {
      const departure = { lng: -99.1332, lat: 19.4326 };
      const orders = [
        {
          id: 'ORD001',
          lng: -99.2,
          lat: 19.45,
          products: [{ id: 'PROD001', volume: 500 }],
        },
        {
          id: 'ORD002',
          lng: -99.15,
          lat: 19.46,
          products: [{ id: 'PROD002', volume: 700 }],
        },
        {
          id: 'ORD003',
          lng: -99.18,
          lat: 19.44,
          products: [
            { id: 'PROD003', volume: 1000 },
            { id: 'PROD004', volume: 500 },
          ],
        },
      ];
      const truckCapacity = 1000;

      const prompt = generarPromptOptimizacionRutas({
        departure,
        orders,
        truckCapacity,
      });

      console.log('Enviando prompt al proveedor de AI');

      const respuesta = await this.aiProviderService.enviarPrompt(prompt);

      console.log('Respuesta:', respuesta.content);
    } catch (error) {
      console.error('Error calculando ruta:', error);
    }
  }

  actualizarRuta(ruta: IRespuestaApi3): Observable<null> {
    console.log('Actualizando ruta:', ruta);
    return of(null);
  }
}
