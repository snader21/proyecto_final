import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresService } from './vendedores.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';

describe('VendedoresService (Orquestador)', () => {
  let service: VendedoresService;
  let usuariosService: UsuariosService;
  let httpService: HttpService;

  const apiUrl = faker.internet.url();

  const mockUsuario = {
    id: faker.string.uuid(),
    nombre: faker.person.firstName(),
    correo: faker.internet.email(),
    estado: faker.helpers.arrayElement(['active', 'inactive']),
  };

  const vendedor = {
    id: faker.string.uuid(),
    nombre: mockUsuario.nombre,
    correo: mockUsuario.correo,
    telefono: faker.phone.number(),
    usuario_id: mockUsuario.id,
  };

  const mockCreateDto: CreateVendedorDto = {
    nombre: mockUsuario.nombre,
    correo: mockUsuario.correo,
    contrasena: 'password123',
    estado: mockUsuario.estado,
    telefono: vendedor.telefono,
    zonaId: faker.string.uuid(),
    roles: [faker.string.uuid()],
  };

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsuariosService = {
    crearUsuario: jest.fn(),
    eliminarUsuario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendedoresService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: UsuariosService, useValue: mockUsuariosService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(apiUrl),
          },
        },
      ],
    }).compile();

    service = module.get<VendedoresService>(VendedoresService);
    usuariosService = module.get<UsuariosService>(UsuariosService);
    httpService = module.get<HttpService>(HttpService);

    jest.clearAllMocks();
  });

  it('debería crear un vendedor correctamente', async () => {
    mockUsuariosService.crearUsuario.mockResolvedValueOnce(mockUsuario);
    mockHttpService.post.mockReturnValueOnce(
      of({ data: vendedor } as AxiosResponse),
    );

    const result = await service.crearVendedor(mockCreateDto);
    expect(result).toEqual(vendedor);
    expect(mockUsuariosService.crearUsuario).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalled();
  });

  it('debería lanzar BadRequestException y eliminar el usuario si falla la creación del vendedor', async () => {
    mockUsuariosService.crearUsuario.mockResolvedValueOnce(mockUsuario);

    const axiosLikeError = {
      response: { data: { message: 'Error desde API vendedores' } },
    };

    mockHttpService.post.mockReturnValueOnce(throwError(() => axiosLikeError));

    await expect(service.crearVendedor(mockCreateDto)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockUsuariosService.eliminarUsuario).toHaveBeenCalledWith(
      mockUsuario.id,
    );
  });

  it('no deberia llamar al servicio de vendedores si no se puede crear el usuario', async () => {
    mockUsuariosService.crearUsuario.mockRejectedValueOnce(
      new Error('Error al crear el usuario'),
    );
    await expect(service.crearVendedor(mockCreateDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockUsuariosService.eliminarUsuario).not.toHaveBeenCalled();
  });

  it('debería retornar todos los vendedores', async () => {
    const vendedores = [vendedor];
    mockHttpService.get.mockReturnValueOnce(
      of({ data: vendedores } as AxiosResponse),
    );

    const result = await service.findAll();
    expect(result).toEqual(vendedores);
    expect(mockHttpService.get).toHaveBeenCalledWith(`${apiUrl}/vendedores`);
  });

  it('debería retornar un vendedor específico', async () => {
    mockHttpService.get.mockReturnValueOnce(
      of({ data: vendedor } as AxiosResponse),
    );

    const result = await service.findOne(vendedor.id);
    expect(result).toEqual(vendedor);
    expect(mockHttpService.get).toHaveBeenCalledWith(
      `${apiUrl}/vendedores/${vendedor.id}`,
    );
  });

  it('debería lanzar NotFoundException si no se encuentra el vendedor', async () => {
    mockHttpService.get.mockReturnValueOnce(
      throwError(() => {
        const error = new NotFoundException('No encontrado');
        (error as any).response = {
          status: 404,
          data: { message: 'No encontrado' },
        };
        return error;
      }),
    );

    await expect(service.findOne('fake-id')).rejects.toThrow(NotFoundException);
  });

  it('debería eliminar un vendedor y su usuario', async () => {
    mockHttpService.get.mockReturnValueOnce(
      of({ data: vendedor } as AxiosResponse),
    );
    mockHttpService.delete.mockReturnValueOnce(
      of({ data: {} } as AxiosResponse),
    );

    await service.remove(vendedor.id);

    expect(mockHttpService.get).toHaveBeenCalled();
    expect(mockUsuariosService.eliminarUsuario).toHaveBeenCalledWith(
      vendedor.usuario_id,
    );
    expect(mockHttpService.delete).toHaveBeenCalledWith(
      `${apiUrl}/vendedores/${vendedor.id}`,
    );
  });

  it('debería lanzar NotFoundException si no se puede eliminar porque no existe', async () => {
    const error = new NotFoundException('No existe');
    (error as any).response = { status: 404, data: { message: 'No existe' } };
    mockHttpService.get.mockReturnValueOnce(throwError(() => error));

    await expect(service.remove('no-id')).rejects.toThrow(NotFoundException);
  });
});
