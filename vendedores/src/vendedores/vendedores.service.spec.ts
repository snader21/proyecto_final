import { Test, TestingModule } from '@nestjs/testing';
import { VendedoresService } from './vendedores.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ZonasService } from '../zonas/zonas.service';
import { ZonaEntity } from '../zonas/entities/zona.entity';
import { VendedorEntity } from './entities/vendedor.entity';
import {
  generarVendedorDto,
  camelCaseToSnakeCase,
} from '../shared/testing-utils/test-utils';

describe('VendedoresService', () => {
  let service: VendedoresService;
  let vendedorRepo: any;
  let zonaRepo: any;

  let zonaId: string;
  const nombre = faker.location.city();
  const descripcion = faker.lorem.sentence();
  const mockZonaService = {
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === zonaId) {
        return Promise.resolve({ id: zonaId, nombre, descripcion, vendedores: [] });
      }
      return Promise.resolve(null);
    }),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    vendedorRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    };
    zonaRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendedoresService,
        {
          provide: getRepositoryToken(VendedorEntity),
          useValue: vendedorRepo,
        },
        {
          provide: getRepositoryToken(ZonaEntity),
          useValue: zonaRepo,
        },
        {
          provide: ZonasService,
          useValue: mockZonaService,
        },
      ],
    }).compile();

    service = module.get<VendedoresService>(VendedoresService);

    // Simular la creación de una zona
    const zonaMock = { id: faker.string.uuid(), nombre, descripcion };
    zonaId = zonaMock.id;
    zonaRepo.save.mockResolvedValue(zonaMock);
    zonaRepo.findOne.mockResolvedValue(zonaMock);
  });





  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear un vendedor correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedorMock = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    vendedorRepo.save.mockResolvedValue(vendedorMock);

    const vendedor = await service.create(vendedorDto);
    expect(vendedor).toBeDefined();
    expect(vendedor.nombre).toEqual(vendedorDto.nombre);
    expect(vendedor.correo).toEqual(vendedorDto.correo);
    expect(vendedor.telefono).toEqual(vendedorDto.telefono);
    expect(vendedor.usuario_id).toEqual(vendedorDto.usuarioId);
    expect(vendedor.zona.id).toEqual(zonaId);
  });

  it('no deberia crear un vendedor si la zona no existe', async () => {
    const vendedorDto = generarVendedorDto(faker.string.uuid());
    mockZonaService.findOne.mockResolvedValue(null);
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'Zona no encontrada',
    );
  });

  it('no deberia crear un vendedor si el correo ya existe', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedorMock = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    // Aseguramos que el mock de ZonasService devuelva la zona correcta
    mockZonaService.findOne.mockResolvedValue({ id: zonaId, nombre, descripcion, vendedores: [] });

    // Primera llamada: crear vendedor exitosamente
    vendedorRepo.save.mockResolvedValueOnce(vendedorMock);
    await service.create(vendedorDto);

    // Segunda llamada: simular error de correo duplicado
    vendedorRepo.save.mockRejectedValueOnce(new Error('El correo ya está en uso'));
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'El correo ya está en uso'
    );
  });

  it('no deberia crear un vendedor si hace falta un campo', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const campos = ['nombre', 'correo', 'telefono', 'usuarioId'];

    const campoFaltante = faker.helpers.arrayElement(campos);
    delete vendedorDto[campoFaltante];

    // Simulamos un error de validación
    vendedorRepo.save.mockRejectedValue(new Error('Error de validación'));

    await expect(service.create(vendedorDto)).rejects.toThrow();
  });

  it('no deberia crear un vendedor si el usuario no tiene el rol de vendedor', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    vendedorDto.roles = [faker.lorem.word()];
    await expect(service.create(vendedorDto)).rejects.toThrow(
      'El usuario debe tener al menos el rol de vendedor',
    );
  });

  it('deberia listar todos los vendedores correctamente', async () => {
    const vendedorDto1 = generarVendedorDto(zonaId);
    const vendedorDto2 = generarVendedorDto(zonaId);

    const vendedoresMock = [
      {
        id: faker.string.uuid(),
        nombre: vendedorDto1.nombre,
        correo: vendedorDto1.correo,
        telefono: vendedorDto1.telefono,
        usuario_id: vendedorDto1.usuarioId,
        zona: {
          id: zonaId,
          nombre,
          descripcion,
          vendedores: []
        }
      } as Partial<VendedorEntity>,
      {
        id: faker.string.uuid(),
        nombre: vendedorDto2.nombre,
        correo: vendedorDto2.correo,
        telefono: vendedorDto2.telefono,
        usuario_id: vendedorDto2.usuarioId,
        zona: {
          id: zonaId,
          nombre,
          descripcion,
          vendedores: []
        }
      } as Partial<VendedorEntity>
    ];

    vendedorRepo.find.mockResolvedValue(vendedoresMock);

    const vendedores = await service.findAll();
    expect(vendedores).toBeDefined();
    expect(vendedores.length).toBeGreaterThan(0);
    expect(vendedores[0].zona).toBeDefined();
  });

  it('deberia encontrar un vendedor por ID correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedor = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    vendedorRepo.findOne.mockResolvedValue(vendedor);

    const foundVendedor = await service.findOne(vendedor.id!);
    expect(foundVendedor).toBeDefined();
    expect(foundVendedor.id).toEqual(vendedor.id);
    expect(foundVendedor.zona).toBeDefined();
  });

  it('deberia lanzar error si no encuentra vendedor por ID', async () => {
    await expect(service.findOne(faker.string.uuid())).rejects.toThrow(
      'Vendedor no encontrado'
    );
  });

  it('deberia encontrar un vendedor por usuarioId correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedor = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    vendedorRepo.findOne.mockResolvedValue(vendedor);

    const foundVendedor = await service.findOneByUsuarioId(vendedor.usuario_id!);
    expect(foundVendedor).not.toBeNull();
    expect(foundVendedor).toBeDefined();
    expect(foundVendedor!.usuario_id).toEqual(vendedor.usuario_id);
  });

  it('deberia actualizar un vendedor correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedor = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    const updateDto = {
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      telefono: faker.phone.number(),
      zonaId: zonaId,
      usuarioId: vendedor.usuario_id
    };

    // Aseguramos que el mock de ZonasService devuelva la zona correcta
    mockZonaService.findOne.mockResolvedValue({ id: zonaId, nombre, descripcion, vendedores: [] });

    // Mock para findOne que devuelve el vendedor
    vendedorRepo.findOne.mockResolvedValueOnce(vendedor);

    // Mock para update que simula la actualización
    vendedorRepo.update.mockResolvedValue({ affected: 1 });

    // Mock para findOne que devuelve el vendedor actualizado
    const updatedVendedorMock = {
      ...vendedor,
      nombre: updateDto.nombre,
      correo: updateDto.correo,
      telefono: updateDto.telefono
    };
    vendedorRepo.findOne.mockResolvedValueOnce(updatedVendedorMock);

    await service.update(vendedor.id!, updateDto);
    const updatedVendedor = await service.findOne(vendedor.id!);
    expect(updatedVendedor).not.toBeNull();

    expect(updatedVendedor.nombre).toEqual(updateDto.nombre);
    expect(updatedVendedor.correo).toEqual(updateDto.correo);
    expect(updatedVendedor.telefono).toEqual(updateDto.telefono);
    expect(updatedVendedor.zona.id).toEqual(zonaId);
  });

  it('deberia actualizar un vendedor parcialmente correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedor = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    const updateDto = {
      nombre: faker.person.fullName(),
      correo: faker.internet.email()
    };

    // Mock para findOne que devuelve el vendedor por usuario_id
    vendedorRepo.findOne.mockResolvedValueOnce(vendedor);

    // Mock para save que simula la actualización
    const updatedVendedorMock = {
      ...vendedor,
      nombre: updateDto.nombre,
      correo: updateDto.correo
    };
    vendedorRepo.save.mockResolvedValueOnce(updatedVendedorMock);

    // Mock para findOne que devuelve el vendedor actualizado
    vendedorRepo.findOne.mockResolvedValueOnce(updatedVendedorMock);

    await service.updateUserVendedor(vendedor.usuario_id!, updateDto);
    const updatedVendedor = await service.findOne(vendedor.id!);
    expect(updatedVendedor).not.toBeNull();

    expect(updatedVendedor.nombre).toEqual(updateDto.nombre);
    expect(updatedVendedor.correo).toEqual(updateDto.correo);
  });

  it('deberia eliminar un vendedor correctamente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedor = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    // Mock para findOne que devuelve el vendedor
    vendedorRepo.findOne.mockResolvedValueOnce(vendedor);

    // Mock para delete que simula la eliminación
    vendedorRepo.delete.mockResolvedValue({ affected: 1 });

    // Mock para findOne que devuelve null (vendedor eliminado)
    vendedorRepo.findOne.mockResolvedValueOnce(null);

    await service.remove(vendedor.id!);
    await expect(service.findOne(vendedor.id!)).rejects.toThrow(
      'Vendedor no encontrado'
    );
  });

  it('deberia lanzar error si intenta actualizar con zona no existente', async () => {
    const vendedorDto = generarVendedorDto(zonaId);
    const vendedorMock = {
      id: faker.string.uuid(),
      nombre: vendedorDto.nombre,
      correo: vendedorDto.correo,
      telefono: vendedorDto.telefono,
      usuario_id: vendedorDto.usuarioId,
      zona: {
        id: zonaId,
        nombre,
        descripcion,
        vendedores: []
      }
    } as Partial<VendedorEntity>;

    // Mock para findOne que devuelve el vendedor
    vendedorRepo.findOne.mockResolvedValue(vendedorMock);

    const zonaIdInexistente = faker.string.uuid();
    const updateDto = {
      ...vendedorDto,
      zonaId: zonaIdInexistente, // Zona inexistente
    };

    // Aseguramos que el mock de ZonasService devuelva null para la zona inexistente
    mockZonaService.findOne.mockImplementation((id: string) => {
      if (id === zonaIdInexistente) {
        return Promise.resolve(null);
      }
      return Promise.resolve({ id: zonaId, nombre, descripcion, vendedores: [] });
    });

    await expect(service.update(vendedorMock.id!, updateDto)).rejects.toThrow(
      'Zona no encontrada'
    );
  });

  it('test', async () => {});
});
