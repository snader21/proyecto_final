import { Test, TestingModule } from '@nestjs/testing';
import { InventariosController } from './inventarios.controller';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { InventariosService } from './inventarios.service';
const mockInventariosService = {
  obtenerInventarioDeProductos: jest.fn(),
};

describe('InventariosController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [InventariosController],
      providers: [
        {
          provide: InventariosService,
          useValue: mockInventariosService,
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
    describe('Obtener inventario de productos', () => {
      it('deberia obtener el inventario de productos correctamente', async () => {
        const dto = {
          nombre_producto: faker.commerce.productName(),
        };
        mockInventariosService.obtenerInventarioDeProductos.mockResolvedValue({
          id_producto: faker.string.uuid(),
          nombre: faker.commerce.productName(),
          inventario: faker.number.int({ min: 1, max: 100 }),
        });

        return request(app.getHttpServer())
          .get('/inventarios')
          .query(dto)
          .expect(200);
      });
    });

    it('deberia retornar 400 si no se envia el nombre del producto', async () => {
      const dto = {};

      return request(app.getHttpServer())
        .get('/inventarios')
        .query(dto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain(
            'El patrón para el nombre del producto es requerido',
          ),
        );
    });

    it('deberia rechazar una propiedad no permitida', async () => {
      const dto = {
        nombre_producto: faker.commerce.productName(),
        propiedad_no_permitida: faker.string.uuid(),
      };

      return request(app.getHttpServer())
        .get('/inventarios')
        .query(dto)
        .expect(400)
        .expect((res) =>
          expect(res.body.message).toContain(
            'property propiedad_no_permitida should not exist',
          ),
        );
    });
  });
});
