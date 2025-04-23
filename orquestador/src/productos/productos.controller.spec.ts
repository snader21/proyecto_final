import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreateEntradaInventarioDto } from './dto/create-entrada-inventario.dto';

describe('ProductosService - crearMovimientoInventario', () => {
  let service: ProductosService;
  let httpService: HttpService;

  const mockUrl = faker.internet.url();
  const mockDto: CreateEntradaInventarioDto = {
    idProducto: faker.string.uuid(),
    idUbicacion: faker.string.uuid(),
    cantidad: faker.number.int({ min: 1, max: 100 }),
    idUsuario: faker.string.uuid(),
    fechaRegistro: new Date().toISOString(),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(mockUrl),
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
      of({ data: mockDto } as AxiosResponse),
    );

    const result = await service.crearEntradaInventario(mockDto);
    expect(result).toEqual(mockDto);
    expect(mockHttpService.post).toHaveBeenCalled();
  });

  it('debería lanzar NotFoundException si la API responde 404', async () => {
    const axiosError = {
      response: {
        status: 404,
        data: { message: 'No encontrado' },
      },
    } as AxiosError;

    mockHttpService.post.mockReturnValueOnce(throwError(() => axiosError));

    await expect(service.crearEntradaInventario(mockDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería lanzar BadRequestException para otros errores', async () => {
    const axiosError = {
      response: {
        status: 500,
        data: { message: 'Error interno' },
      },
    } as AxiosError;

    mockHttpService.post.mockReturnValueOnce(throwError(() => axiosError));

    await expect(service.crearEntradaInventario(mockDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
