import { Test, TestingModule } from '@nestjs/testing';
import { MovimientosInventarioController } from './movimientos-inventario.controller';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { generarEntradaInventarioDto } from '../shared/testing-utils/test-utils';
import { faker } from '@faker-js/faker';
import { CreateEntradaInventarioDto } from './dto/create-entrada-invenario.dto';
const mockMovimientosInventarioService = {
  generarEntradaInventario: jest.fn(),
};

describe('MovimientosInventarioController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MovimientosInventarioController],
      providers: [
        {
          provide: MovimientosInventarioService,
          useValue: mockMovimientosInventarioService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Validation Pipe', () => {
    describe('Create movimiento inventario', () => {
      it('deberia crear un movimiento inventario de entrada correctamente', async () => {
        const dto = generarEntradaInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
        mockMovimientosInventarioService.generarEntradaInventario.mockResolvedValue(
          {
            id: faker.string.uuid(),
            ...dto,
          },
        );

        return request(app.getHttpServer())
          .post('/movimientos-inventario/entradas')
          .send(dto)
          .expect(201);
      });
    });

    it('deberia retornar 400 si no se envia el producto en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      const { idProducto: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('El producto es requerido'),
        );
    });

    it('deberia retornar 400 si el producto no es un uuid v4 en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.lorem.word(), faker.string.uuid());
      dto.idProducto = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dto)
        .expect(400);
    });
    it('deberia retornar 400 si no se envia la ubicacion en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      const { idUbicacion: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('La ubicación es requerida'),
        );
    });

    it('deberia retornar 400 si la ubicacion no es un uuid v4 en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      dto.idUbicacion = '123';
      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si no se envia la cantidad en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      const { cantidad: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('La cantidad es requerida'),
        );
    });

    it('deberia retornar 400 si la cantidad no es un numero positivo en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      dto.cantidad = -1;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si la cantidad es 0 en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      dto.cantidad = 0;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si no se envia el usuario en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      const { idUsuario: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('El usuario es requerido'),
        );
    });

    it('deberia retornar 400 si el usuario no es un uuid v4 en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      dto.idUsuario = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si no se envia la fecha de registro en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      const { fechaRegistro: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dtoIncompleto)
        .expect(400);
    });

    it('deberia retornar 400 si la fecha de registro no es una fecha valida en un movimiento de entrada', async () => {
      const dto: Partial<CreateEntradaInventarioDto> =
        generarEntradaInventarioDto(faker.string.uuid(), faker.string.uuid());
      dto.fechaRegistro = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario/entradas')
        .send(dto)
        .expect(400);
    });
  });
});
