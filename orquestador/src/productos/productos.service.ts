import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { map, tap } from 'rxjs/operators';
import { async, firstValueFrom, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { CreateEntradaInventarioDto } from './dto/create-entrada-inventario.dto';
import {
  EntradaInventarioDto,
  PreReservaInventarioDto,
} from './dto/movimiento-inventario.dto';
import { QueryInventarioDto } from './dto/query-inventario.dto';
import { ProductoConInventarioDto } from './dto/producto-con-inventario.dto';
import { CreatePreReservaInventarioDto } from './dto/create-pre-reserva-inventario.dto';

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
  tipo_movimiento: string;
  id_bodega: string;
  nombre_bodega: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

@Injectable()
export class ProductosService {
  private readonly apiProductos =
    this.configService.get<string>('URL_PRODUCTOS');
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  obtenerProductosDePedidosConfirmados(
    id_pedido: string,
  ): Observable<IRespuestaProducto[]> {
    const api = this.configService.get<string>('URL_PRODUCTOS');
    const apiEndPoint = `${api}/productos/${id_pedido}`;

    return this.httpService.get<IRespuestaProducto[]>(apiEndPoint).pipe(
      map((respuesta) => respuesta.data),
      map((productos) =>
        productos.filter(
          (producto) => producto.tipo_movimiento === 'Reserva Confirmada',
        ),
      ),
    );
  }

  async crearEntradaInventario(dto: CreateEntradaInventarioDto) {
    const apiEndPoint = `${this.apiProductos}/movimientos-inventario/entradas`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<EntradaInventarioDto>(apiEndPoint, dto),
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

  async crearPreReservaInventario(dto: CreatePreReservaInventarioDto) {
    const apiEndPoint = `${this.apiProductos}/movimientos-inventario/pre-reservas`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<PreReservaInventarioDto[]>(apiEndPoint, dto),
      );
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new BadRequestException(axiosError?.response?.data?.message);
    }
  }

  async getInventario(query: QueryInventarioDto) {
    const apiEndPoint = `${this.apiProductos}/inventarios`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ProductoConInventarioDto[]>(apiEndPoint, {
          params: query,
        }),
      );
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new BadRequestException(axiosError?.response?.data?.message);
    }
  }

  async getCategories() {
    const apiEndPoint = `${this.apiProductos}/productos/categorias`;
    return this.httpService
      .get<any[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  async getBrands() {
    const apiEndPoint = `${this.apiProductos}/productos/marcas`;
    return this.httpService
      .get<any[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  async getUnits() {
    const apiEndPoint = `${this.apiProductos}/productos/unidades-medida`;
    return this.httpService
      .get<any[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  async getProducts() {
    const apiEndPoint = `${this.apiProductos}/productos`;
    return this.httpService
      .get<any[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  async saveProduct(product: any, files?: any[]) {
    const apiEndPoint = `${this.apiProductos}/productos`;

    // Create form data with proper headers for multipart/form-data
    const FormData = require('form-data');
    const form = new FormData();
    form.append('product', JSON.stringify(product));

    if (files && files.length > 0) {
      files.forEach((file) => {
        form.append('images', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });
    }

    return this.httpService
      .post<any>(apiEndPoint, form, {
        headers: {
          ...form.getHeaders(),
        },
      })
      .pipe(map((respuesta) => respuesta.data));
  }

  async uploadCSV(file: any): Promise<{ url: string }> {
    const apiEndPoint = `${this.apiProductos}/productos/upload-csv`;
    const FormData = require('form-data');
    const form = new FormData();

    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    return firstValueFrom(
      this.httpService
        .post<{ url: string }>(apiEndPoint, form, {
          headers: {
            ...form.getHeaders(),
          },
        })
        .pipe(map((respuesta) => respuesta.data)),
    );
  }

  async getCSVFiles() {
    const apiEndPoint = `${this.apiProductos}/productos/archivos-csv`;
    return this.httpService
      .get<any[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  async getUbicaciones() {
    const apiEndPoint = `${this.apiProductos}/ubicaciones`;
    return this.httpService
      .get<any[]>(apiEndPoint)
      .pipe(map((respuesta) => respuesta.data));
  }

  async uploadImages(files: any[]) {
    console.log('Iniciando uploadImages con:', files.length, 'archivos');
    const apiEndPoint = `${this.apiProductos}/productos/upload-images`;
    const FormData = require('form-data');
    const form = new FormData();

    files.forEach((file, index) => {
      console.log(`Procesando archivo ${index + 1}:`, {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      });
      form.append('files', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    console.log('Enviando petición a:', apiEndPoint);
    return firstValueFrom(
      this.httpService
        .post(apiEndPoint, form, {
          headers: {
            ...form.getHeaders(),
          },
        })
        .pipe(
          tap((response) =>
            console.log('Respuesta del servidor:', response.data),
          ),
          map((respuesta) => respuesta.data),
        ),
    ).catch((error) => {
      console.error('Error en uploadImages:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    });
  }

  async getImageFiles() {
    const apiEndPoint = `${this.apiProductos}/productos/archivos-imagenes`;
    return firstValueFrom(
      this.httpService
        .get(apiEndPoint)
        .pipe(map((respuesta) => respuesta.data)),
    );
  }
}
