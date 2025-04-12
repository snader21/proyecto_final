import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { MovimientoInventarioDto } from './dto/movimiento-inventario.dto';
import { QueryInventarioDto } from './dto/query-inventario.dto';
import { ProductoConInventarioDto } from './dto/producto-con-inventario.dto';

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
    const apiEndPoint = `${this.apiProductos}/movimientos-inventario`;

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
    const apiEndPoint = `${this.apiProductos}/productos/upload-images`;
    const form = new FormData();

    files.forEach((file) => {
      form.append('images', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    return firstValueFrom(
      this.httpService
        .post(apiEndPoint, form, {
          headers: {
            ...form.getHeaders(),
          },
        })
        .pipe(map((respuesta) => respuesta.data)),
    );
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
