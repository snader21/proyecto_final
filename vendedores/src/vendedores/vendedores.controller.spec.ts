import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { VendedoresController } from './vendedores.controller';
import { VendedoresService } from './vendedores.service';
import * as request from 'supertest';
import { generarVendedorDto } from '../shared/testing-utils/test-utils';
import { CreateVendedorDto } from './dto/create-vendedor.dto';

const mockVendedoresService = {
  create: jest.fn(),
};

describe('VendedoresController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VendedoresController],
      providers: [
        { provide: VendedoresService, useValue: mockVendedoresService },
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
    describe('Create vendedor', () => {
      it('deberia crear un vendedor correctamente', async () => {
        const dto = generarVendedorDto(1, 1);
        mockVendedoresService.create.mockResolvedValue({ id: 1, ...dto });

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(201);
      });

      it('deberia retornar 400 si no se envia el nombre', async () => {
        const dto: Partial<CreateVendedorDto> = generarVendedorDto(1, 1);
        delete dto.nombre;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El nombre es requerido'),
          );
      });

      it('deberia retornar 400 si no se envia el correo', async () => {
        const dto: Partial<CreateVendedorDto> = generarVendedorDto(1, 1);
        delete dto.correo;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El correo es requerido'),
          );
      });

      it('deberia retornar 400 si no se envia el telefono', async () => {
        const dto: Partial<CreateVendedorDto> = generarVendedorDto(1, 1);
        delete dto.telefono;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El teléfono es requerido'),
          );
      });

      it('deberia retornar 400 si no se envia la zona', async () => {
        const dto: Partial<CreateVendedorDto> = generarVendedorDto(1, 1);
        delete dto.zonaId;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('La zona es requerida'),
          );
      });

      it('deberia retornar 400 si no se envia el estado', async () => {
        const dto: Partial<CreateVendedorDto> = generarVendedorDto(1, 1);
        delete dto.estadoId;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El estado es requerido'),
          );
      });

      it('deberia retornar 400 si no se envia el usuario', async () => {
        const dto: Partial<CreateVendedorDto> = generarVendedorDto(1, 1);
        delete dto.usuarioId;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El usuario es requerido'),
          );
      });

      it('deberia retornar 400 si el correo es invalido', async () => {
        const dto = generarVendedorDto(1, 1);
        dto.correo = 'invalid-email';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain(
              'El correo debe ser una dirección de correo electrónico válida',
            ),
          );
      });

      it('deberia retornar 400 si la zona no es un numero', async () => {
        const dto = generarVendedorDto(1, 1) as any;
        dto.zonaId = 'abc';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('La zona debe ser un número'),
          );
      });

      it('deberia retornar 400 si hay campos extra', async () => {
        const dto: any = generarVendedorDto(1, 1);
        dto.extraField = 'not allowed';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain(
              'property extraField should not exist',
            ),
          );
      });

      it('deberia retornar 400 si el estado no es un numero', async () => {
        const dto = generarVendedorDto(1, 1) as any;
        dto.estadoId = 'abc';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El estado debe ser un número'),
          );
      });

      it('deberia retornar 400 si el usuario no es un numero', async () => {
        const dto = generarVendedorDto(1, 1) as any;
        dto.usuarioId = 'abc';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El usuario debe ser un número'),
          );
      });

      it('deberia retornar 400 si la zona no es un numero', async () => {
        const dto = generarVendedorDto(1, 1) as any;
        dto.zonaId = 'abc';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('La zona debe ser un número'),
          );
      });

      it('deberia retornar 400 si el estado no es un numero', async () => {
        const dto = generarVendedorDto(1, 1) as any;
        dto.estadoId = 'abc';

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain('El estado debe ser un número'),
          );
      });

      it('deberia retornar 400 si el telefono no es una cadena de caracteres', async () => {
        const dto = generarVendedorDto(1, 1) as any;
        dto.telefono = 1234567890;

        return request(app.getHttpServer())
          .post('/vendedores')
          .send(dto)
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toContain(
              'El teléfono debe ser una cadena de caracteres',
            ),
          );
      });
    });
  });
});
