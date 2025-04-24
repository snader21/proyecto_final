import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateEntradaInventarioDto } from './dto/create-entrada-inventario.dto';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('ProductosService', () => {
  let service: ProductosService;
  let httpService: HttpService;

  const apiUrl = faker.internet.url();

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(apiUrl),
  };

  const mockMovimientoInventario = {
    id_movimiento: faker.string.uuid(),
    id_pedido: faker.string.uuid(),
    cantidad: faker.number.int({ min: 1, max: 100 }),
    tipo_movimiento: 'Entrada',
    fecha_registro: new Date().toISOString(),
    id_usuario: faker.string.uuid(),
    producto: {
      id_producto: faker.string.uuid(),
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      sku: faker.string.uuid(),
      precio: faker.commerce.price(),
      alto: faker.number.int({ min: 1, max: 100 }),
      largo: faker.number.int({ min: 1, max: 100 }),
      ancho: faker.number.int({ min: 1, max: 100 }),
      peso: faker.number.int({ min: 1, max: 100 }),
    },
    ubicacion: {
      id_ubicacion: faker.string.uuid(),
      nombre: faker.commerce.department(),
      descripcion: faker.commerce.productDescription(),
    },
  };

  const mockDto: CreateEntradaInventarioDto = {
    idProducto: faker.string.uuid(),
    idUbicacion: faker.string.uuid(),
    cantidad: faker.number.int({ min: 1, max: 100 }),
    idUsuario: faker.string.uuid(),
    fechaRegistro: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    httpService = module.get<HttpService>(HttpService);
    jest.clearAllMocks();
  });

  it('debería crear un movimiento de inventario correctamente', async () => {
    mockHttpService.post.mockReturnValueOnce(
      of({ data: mockMovimientoInventario } as AxiosResponse),
    );

    const result = await service.crearEntradaInventario(mockDto);
    expect(result).toEqual(mockMovimientoInventario);
    expect(mockHttpService.post).toHaveBeenCalled();
  });

  it('debería lanzar BadRequestException si la API responde otro error', async () => {
    const axiosLikeError = {
      response: { data: { message: 'Error desde API vendedores' } },
    };

    mockHttpService.post.mockReturnValueOnce(throwError(() => axiosLikeError));

    await expect(service.crearEntradaInventario(mockDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería lanzar NotFoundException si la API responde 404', async () => {
    mockHttpService.post.mockReturnValueOnce(
      throwError(() => {
        const error = new NotFoundException('No encontrado');
        (error as any).response = {
          status: 404,
          data: { message: 'No encontrado' },
        };
        return error;
      }),
    );

    await expect(service.crearEntradaInventario(mockDto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
