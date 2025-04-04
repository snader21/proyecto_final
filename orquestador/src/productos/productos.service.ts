import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { AxiosError } from 'axios';
import { MovimientoInventarioDto } from './dto/movimiento-inventario.dto';

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
  private readonly apiProductos =
    this.configService.get<string>('URL_PRODUCTOS');
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

  async crearMovimientoInventario(dto: CreateMovimientoInventarioDto) {
    const apiEndPoint = `${this.apiProductos}/productos/movimientos-inventario`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<MovimientoInventarioDto>(apiEndPoint, dto),
      );
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError?.response?.status === 404) {
        throw new NotFoundException(axiosError?.response?.data?.message);
      }
      throw new BadRequestException(axiosError?.response?.data?.message);
    }
  }
}
