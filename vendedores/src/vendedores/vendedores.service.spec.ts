import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresService } from './vendedores.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { VendedorEntity } from './entities/vendedor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstadosVendedoresService } from '../estados-vendedores/estados-vendedores.service';
import { ZonasService } from '../zonas/zonas.service';
import { EstadoVendedorEntity } from '../estados-vendedores/entities/estado-vendedor.entity';
import { ZonaEntity } from '../zonas/entities/zona.entity';
import { generarVendedorDto } from '../shared/testing-utils/test-utils';

const camelCaseToSnakeCase = (str: string) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

describe('VendedoresService', () => {
  let service: VendedoresService;
  let repositorio: Repository<VendedorEntity>;
  let repositorioEstado: Repository<EstadoVendedorEntity>;
  let repositorioZona: Repository<ZonaEntity>;

  let estadoId: number;
  const estado = faker.word.adjective();
  const mockEstadoVendedorService = {
    findOne: jest.fn((id: number) => {
      if (id === estadoId) {
        return Promise.resolve({ id: estadoId, estado });
      }
      return Promise.resolve(null);
    }),
    findAll: jest.fn(),
  };

  let zonaId: number;
  const nombre = faker.location.city();
  const descripcion = faker.lorem.sentence();
  const mockZonaService = {
    findOne: jest.fn((id: number) => {
      if (id === zonaId) {
        return Promise.resolve({ id: zonaId, nombre, descripcion });
      }
      return Promise.resolve(null);
    }),
    findAll: jest.fn(),
  };

  const insertarEstadoYZonaEnBaseDeDatos = async () => {
    const entidadEstado = await repositorioEstado.save({ estado });
    const entidadZona = await repositorioZona.save({ nombre, descripcion });
    estadoId = entidadEstado.id;
    zonaId = entidadZona.id;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        VendedoresService,
        {
          provide: EstadosVendedoresService,
          useValue: mockEstadoVendedorService,
        },
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
    repositorioEstado = module.get<Repository<EstadoVendedorEntity>>(
      getRepositoryToken(EstadoVendedorEntity),
    );
    repositorioZona = module.get<Repository<ZonaEntity>>(
      getRepositoryToken(ZonaEntity),
    );
    await insertarEstadoYZonaEnBaseDeDatos();
  });

  afterEach(async () => {
    await repositorio.clear();
    await repositorioEstado.clear();
    await repositorioZona.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear un vendedor correctamente', async () => {
    const vendedorDto = generarVendedorDto(estadoId, zonaId);

    const vendedor = await service.create(vendedorDto);
    expect(vendedor).toBeDefined();
    expect(vendedor.nombre).toEqual(vendedorDto.nombre);
    expect(vendedor.correo).toEqual(vendedorDto.correo);
    expect(vendedor.telefono).toEqual(vendedorDto.telefono);
    expect(vendedor.usuario_id).toEqual(vendedorDto.usuarioId);
    expect(vendedor.estado.id).toEqual(vendedorDto.estadoId);
    expect(vendedor.zona.id).toEqual(vendedorDto.zonaId);
  });

  it('no deberia crear un vendedor si el estado no existe', async () => {
    const vendedorDto = generarVendedorDto(
      faker.number.int({ min: 100, max: 200 }),
      zonaId,
    );
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'Estado no encontrado',
    );
  });

  it('no deberia crear un vendedor si la zona no existe', async () => {
    const vendedorDto = generarVendedorDto(
      estadoId,
      faker.number.int({ min: 100, max: 200 }),
    );
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'Zona no encontrada',
    );
  });

  it('no deberia crear un vendedor si el correo ya existe', async () => {
    const vendedorDto = generarVendedorDto(estadoId, zonaId);
    await service.create(vendedorDto);
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'SQLITE_CONSTRAINT: UNIQUE constraint failed: vendedor.correo',
    );
  });

  it('no deberia crear un vendedor si hace falta un campo', async () => {
    const vendedorDto = generarVendedorDto(estadoId, zonaId);
    const campos = ['nombre', 'correo', 'telefono', 'usuarioId'];

    const campoFaltante = faker.helpers.arrayElement(campos);
    delete vendedorDto[campoFaltante];
    await expect(service.create(vendedorDto)).rejects.toThrow(
      `SQLITE_CONSTRAINT: NOT NULL constraint failed: vendedor.${camelCaseToSnakeCase(campoFaltante)}`,
    );
  });
});
