import { Test, TestingModule } from '@nestjs/testing';
import { MovimientosInventarioController } from './movimientos-inventario.controller';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { generarMovimientoInventarioDto } from '../shared/testing-utils/test-utils';
import { faker } from '@faker-js/faker';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-invenario.dto';
import { TipoMovimientoEnum } from './enums/tipo-movimiento.enum';
const mockMovimientosInventarioService = {
  crearMovimientoInventario: jest.fn(),
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
      it('deberia crear un movimiento inventario correctamente', async () => {
        const dto = generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
        mockMovimientosInventarioService.crearMovimientoInventario.mockResolvedValue(
          {
            id: faker.string.uuid(),
            ...dto,
          },
        );

        return request(app.getHttpServer())
          .post('/movimientos-inventario')
          .send(dto)
          .expect(201);
      });
    });

    it('deberia retornar 400 si no se envia el producto', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      const { idProducto: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('El producto es requerido'),
        );
    });

    it('deberia retornar 400 si el producto no es un uuid v4', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(faker.lorem.word(), faker.string.uuid());
      dto.idProducto = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });
    it('deberia retornar 400 si no se envia la ubicacion', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(faker.string.uuid(), faker.lorem.word());
      const { idUbicacion: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('La ubicación es requerida'),
        );
    });

    it('deberia retornar 400 si la ubicacion no es un uuid v4', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(faker.string.uuid(), '123');
      dto.idUbicacion = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si no se envia la cantidad', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      const { cantidad: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('La cantidad es requerida'),
        );
    });

    it('deberia retornar 400 si la cantidad no es un numero positivo', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      dto.cantidad = -1;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si la cantidad es 0', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      dto.cantidad = 0;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si no se envia el tipo de movimiento', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      const { tipoMovimiento: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain(
            'El tipo de movimiento es requerido',
          ),
        );
    });

    it('deberia retornar 400 si el tipo de movimiento no es valido', async () => {
      const dto: any = generarMovimientoInventarioDto(
        faker.string.uuid(),
        faker.string.uuid(),
      );
      dto.tipoMovimiento = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si no se envia el usuario', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      const { idUsuario: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dtoIncompleto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain('El usuario es requerido'),
        );
    });

    it('deberia retornar 400 si el usuario no es un uuid v4', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      dto.idUsuario = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });

    it('deberia retornar 400 si el pedido no es un uuid v4', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      dto.idPedido = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });

    it('deberia dejar el pedido opcional', async () => {
      const dto = generarMovimientoInventarioDto(
        faker.string.uuid(),
        faker.string.uuid(),
        TipoMovimientoEnum.ENTRADA,
        false,
      );

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(201);
    });

    it('deberia retornar 400 si no se envia la fecha de registro', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      const { fechaRegistro: _, ...dtoIncompleto } = dto;

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dtoIncompleto)
        .expect(400);
    });

    it('deberia retornar 400 si la fecha de registro no es una fecha valida', async () => {
      const dto: Partial<CreateMovimientoInventarioDto> =
        generarMovimientoInventarioDto(
          faker.string.uuid(),
          faker.string.uuid(),
        );
      dto.fechaRegistro = '123';

      return request(app.getHttpServer())
        .post('/movimientos-inventario')
        .send(dto)
        .expect(400);
    });
  });
});
