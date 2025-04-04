import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresService } from './vendedores.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { VendedorEntity } from './entities/vendedor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ZonasService } from '../zonas/zonas.service';
import { ZonaEntity } from '../zonas/entities/zona.entity';
import {
  generarVendedorDto,
  camelCaseToSnakeCase,
} from '../shared/testing-utils/test-utils';

describe('VendedoresService', () => {
  let service: VendedoresService;
  let repositorio: Repository<VendedorEntity>;
  let repositorioZona: Repository<ZonaEntity>;

  let zonaId: string;
  const nombre = faker.location.city();
  const descripcion = faker.lorem.sentence();
  const mockZonaService = {
    findOne: jest.fn((id: string) => {
      if (id === zonaId) {
        return Promise.resolve({ id: zonaId, nombre, descripcion });
      }
      return Promise.resolve(null);
    }),
    findAll: jest.fn(),
  };

  const insertarEstadoYZonaEnBaseDeDatos = async () => {
    const entidadZona = await repositorioZona.save({ nombre, descripcion });
    zonaId = entidadZona.id;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        VendedoresService,

        {
          provide: ZonasService,
          useValue: mockZonaService,
        },
      ],
    }).compile();

    service = module.get<VendedoresService>(VendedoresService);
    repositorio = module.get<Repository<VendedorEntity>>(
      getRepositoryToken(VendedorEntity),
    );
    repositorioZona = module.get<Repository<ZonaEntity>>(
      getRepositoryToken(ZonaEntity),
    );
    await insertarEstadoYZonaEnBaseDeDatos();
  });

  afterEach(async () => {
    await repositorio.clear();
    await repositorioZona.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear un vendedor correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);

    const vendedor = await service.create(vendedorDto);
    expect(vendedor).toBeDefined();
    expect(vendedor.nombre).toEqual(vendedorDto.nombre);
    expect(vendedor.correo).toEqual(vendedorDto.correo);
    expect(vendedor.telefono).toEqual(vendedorDto.telefono);
    expect(vendedor.usuario_id).toEqual(vendedorDto.usuarioId);
    expect(vendedor.zona.id).toEqual(vendedorDto.zonaId);
  });

  it('no deberia crear un vendedor si la zona no existe', async () => {
    const vendedorDto = generarVendedorDto(faker.string.uuid());
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'Zona no encontrada',
    );
  });

  it('no deberia crear un vendedor si el correo ya existe', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    await service.create(vendedorDto);
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'SQLITE_CONSTRAINT: UNIQUE constraint failed: vendedor.correo',
    );
  });

  it('no deberia crear un vendedor si hace falta un campo', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const campos = ['nombre', 'correo', 'telefono', 'usuarioId'];

    const campoFaltante = faker.helpers.arrayElement(campos);
    delete vendedorDto[campoFaltante];
    await expect(service.create(vendedorDto)).rejects.toThrow(
      `SQLITE_CONSTRAINT: NOT NULL constraint failed: vendedor.${camelCaseToSnakeCase(campoFaltante)}`,
    );
  });

  it('no deberia crear un vendedor si el usuario no tiene el rol de vendedor', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    vendedorDto.roles = [faker.lorem.word()];
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'El usuario debe tener al menos el rol de vendedor',
    );
  });
});
