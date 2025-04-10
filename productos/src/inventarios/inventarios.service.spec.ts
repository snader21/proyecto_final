import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventariosService } from './inventarios.service';
import { InventarioEntity } from './entities/inventario.entity';
import { TipoMovimientoEnum } from '../movimientos-inventario/enums/tipo-movimiento.enum';
import { BadRequestException } from '@nestjs/common';
import { ProductoEntity } from '../productos/entities/producto.entity';
import { PaisEntity } from '../productos/entities/pais.entity';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
import { CategoriaEntity } from '../productos/entities/categoria.entity';
import { MarcaEntity } from '../productos/entities/marca.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { UnidadMedidaEntity } from '../productos/entities/unidad-medida.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductosService } from '../productos/productos.service';
import { MovimientoInventarioEntity } from '../movimientos-inventario/entities/movimiento-inventario.entity';
import { BodegasService } from 'src/bodegas/bodegas.service';
import { UbicacionesService } from 'src/ubicaciones/ubicaciones.service';
import { ProductoConInventarioDto } from './dto/producto-con-inventario.dto';

describe('Pruebas con servicio de inventario mock', () => {
  let service: InventariosService;
  let repositorio: jest.Mocked<Repository<InventarioEntity>>;

  beforeEach(async () => {
    repositorio = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventariosService,
        {
          provide: getRepositoryToken(InventarioEntity),
          useValue: repositorio,
        },
      ],
    }).compile();

    service = module.get<InventariosService>(InventariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerInventarioDeProducto', () => {
    it('should return inventory for product and location', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);

      const result = await service.obtenerInventarioDeProductoEnBodega(
        'PROD-1',
        'UBI-1',
      );

      expect(result).toEqual(mockInventario);
      expect(repositorio.findOne).toHaveBeenCalledWith({
        where: {
          producto: { id_producto: 'PROD-1' },
          ubicacion: { id_ubicacion: 'UBI-1' },
        },
      });
    });

    it('should return null when inventory not found', async () => {
      repositorio.findOne.mockResolvedValue(null);

      const result = await service.obtenerInventarioDeProductoEnBodega(
        'PROD-1',
        'UBI-1',
      );

      expect(result).toBeNull();
    });
  });

  describe('actualizarInventarioDeProducto', () => {
    const mockManager = {
      save: jest.fn(),
    } as any;

    const mockUbicacion = {
      id_ubicacion: 'UBI-1',
    } as any;

    it('should create new inventory when not exists', async () => {
      const mockNewInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 0,
        cantidad_minima: 0,
        cantidad_maxima: 1000,
        fecha_actualizacion: expect.any(Date),
      };

      repositorio.findOne.mockResolvedValue(null);
      mockManager.save.mockResolvedValue(mockNewInventario);

      const result = await service.actualizarInventarioDeProducto(
        'PROD-1',
        TipoMovimientoEnum.ENTRADA,
        mockUbicacion,
        10,
        mockManager,
      );

      expect(result).toEqual(mockNewInventario);
      expect(mockManager.save).toHaveBeenCalledWith(
        InventarioEntity,
        expect.objectContaining({
          producto: { id_producto: 'PROD-1' },
          ubicacion: { id_ubicacion: 'UBI-1' },
          cantidad_disponible: 0,
          cantidad_minima: 0,
          cantidad_maxima: 1000,
        }),
      );
    });

    it('should update inventory for ENTRADA movement', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);
      mockManager.save.mockImplementation((_, inventory) => inventory);

      const result = await service.actualizarInventarioDeProducto(
        'PROD-1',
        TipoMovimientoEnum.ENTRADA,
        mockUbicacion,
        5,
        mockManager,
      );

      expect(result.cantidad_disponible).toBe(15);
      expect(mockManager.save).toHaveBeenCalledWith(
        InventarioEntity,
        expect.any(Object),
      );
    });

    it('should update inventory for SALIDA movement', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);
      mockManager.save.mockImplementation((_, inventory) => inventory);

      const result = await service.actualizarInventarioDeProducto(
        'PROD-1',
        TipoMovimientoEnum.SALIDA,
        mockUbicacion,
        5,
        mockManager,
      );

      expect(result.cantidad_disponible).toBe(5);
      expect(mockManager.save).toHaveBeenCalledWith(
        InventarioEntity,
        expect.any(Object),
      );
    });

    it('should throw error when insufficient stock for SALIDA', async () => {
      const mockInventario: InventarioEntity = {
        id_inventario: '1',
        producto: { id_producto: 'PROD-1' } as any,
        ubicacion: { id_ubicacion: 'UBI-1' } as any,
        cantidad_disponible: 10,
        cantidad_minima: 5,
        cantidad_maxima: 100,
        fecha_actualizacion: new Date(),
      };

      repositorio.findOne.mockResolvedValue(mockInventario);

      await expect(
        service.actualizarInventarioDeProducto(
          'PROD-1',
          TipoMovimientoEnum.SALIDA,
          mockUbicacion,
          15,
          mockManager,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

let service: InventariosService;
let repositorio: Repository<InventarioEntity>;
let repositorioProducto: Repository<ProductoEntity>;

let repositorioMovimientoInventario: Repository<MovimientoInventarioEntity>;
let repositorioPais: Repository<PaisEntity>;
let repositorioCategoria: Repository<CategoriaEntity>;
let repositorioMarca: Repository<MarcaEntity>;
let repositorioUnidadMedida: Repository<UnidadMedidaEntity>;
let repositorioBodega: Repository<BodegaEntity>;
let repositorioUbicacion: Repository<UbicacionEntity>;

interface ProductoPreCreado {
  id: string;
  inventario: number;
  nombre: string;
}

const numProductos = faker.number.int({ min: 200, max: 1000 });
const productosConInventario: Array<ProductoPreCreado> = [];
const productosSinInventario: Array<ProductoPreCreado> = [];

const poblarBaseDeDatos = async (conInventario: boolean) => {
  const entidadPais = await repositorioPais.save({
    nombre: faker.location.country(),
    abreviatura: faker.location.countryCode(),
    moneda: faker.finance.currencyCode(),
    iva: faker.number.int({ min: 0, max: 100 }),
  });
  const paisId = entidadPais.id_pais;

  const entidadCategoria = await repositorioCategoria.save({
    nombre: faker.commerce.department(),
    descripcion: faker.commerce.productDescription(),
  });
  const categoriaId = entidadCategoria.id_categoria;

  const entidadMarca = await repositorioMarca.save({
    nombre: faker.company.name(),
    descripcion: faker.commerce.productDescription(),
  });
  const marcaId = entidadMarca.id_marca;

  const entidadUnidadMedida = await repositorioUnidadMedida.save({
    nombre: faker.commerce.productAdjective(),
    abreviatura: faker.string.alpha(2),
  });
  const unidadMedidaId = entidadUnidadMedida.id_unidad_medida;

  const entidadBodega = await repositorioBodega.save({
    nombre: faker.commerce.department(),
    direccion: faker.location.streetAddress(),
    capacidad: faker.number.int({ min: 1, max: 1000 }),
  });
  const bodegaId = entidadBodega.id_bodega;

  const entidadUbicacion = await repositorioUbicacion.save({
    nombre: faker.commerce.department(),
    descripcion: faker.commerce.productDescription(),
    tipo: faker.commerce.productAdjective(),
    bodega: { id_bodega: bodegaId },
  });
  const ubicacionId = entidadUbicacion.id_ubicacion;

  for (let i = 0; i < numProductos; i++) {
    const entidadProducto = await repositorioProducto.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      sku: faker.string.alpha(10),
      codigo_barras: faker.string.numeric(13),
      categoria: { id_categoria: categoriaId },
      marca: { id_marca: marcaId },
      unidad_medida: { id_unidad_medida: unidadMedidaId },
      precio: faker.number.int({ min: 1000, max: 100000 }),
      activo: true,
      alto: faker.number.int({ min: 1, max: 100 }),
      ancho: faker.number.int({ min: 1, max: 100 }),
      largo: faker.number.int({ min: 1, max: 100 }),
      peso: faker.number.int({ min: 1, max: 100 }),
      fecha_creacion: faker.date.recent(),
      fecha_actualizacion: faker.date.recent(),
      id_fabricante: faker.string.uuid(),
      pais: { id_pais: paisId },
    });

    if (conInventario) {
      const entidadEntradaInventario =
        await repositorioMovimientoInventario.save({
          producto: { id_producto: entidadProducto.id_producto },
          ubicacion: { id_ubicacion: ubicacionId },
          cantidad: faker.number.int({ min: 1, max: 100 }),
          tipo_movimiento: TipoMovimientoEnum.ENTRADA,
          id_usuario: faker.string.uuid(),
          fecha_registro: faker.date.recent(),
        });

      await repositorio.save({
        producto: { id_producto: entidadProducto.id_producto },
        ubicacion: { id_ubicacion: ubicacionId },
        cantidad_disponible: entidadEntradaInventario.cantidad,
        cantidad_minima: 0,
        cantidad_maxima: 1000,
        fecha_actualizacion: faker.date.recent(),
      });

      productosConInventario.push({
        id: entidadProducto.id_fabricante,
        inventario: entidadEntradaInventario.cantidad,
        nombre: entidadProducto.nombre,
      });
    } else {
      productosSinInventario.push({
        id: entidadProducto.id_producto,
        inventario: 0,
        nombre: entidadProducto.nombre,
      });
    }
  }
};

describe('Pruebas con servicio de inventario real', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [InventariosService],
    }).compile();

    service = module.get<InventariosService>(InventariosService);
    repositorio = module.get<Repository<InventarioEntity>>(
      getRepositoryToken(InventarioEntity),
    );
    repositorioProducto = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    repositorioPais = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    repositorioCategoria = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    repositorioMarca = module.get<Repository<MarcaEntity>>(
      getRepositoryToken(MarcaEntity),
    );
    repositorioUnidadMedida = module.get<Repository<UnidadMedidaEntity>>(
      getRepositoryToken(UnidadMedidaEntity),
    );
    repositorioBodega = module.get<Repository<BodegaEntity>>(
      getRepositoryToken(BodegaEntity),
    );
    repositorioUbicacion = module.get<Repository<UbicacionEntity>>(
      getRepositoryToken(UbicacionEntity),
    );
    repositorioMovimientoInventario = module.get<
      Repository<MovimientoInventarioEntity>
    >(getRepositoryToken(MovimientoInventarioEntity));
  });

  afterEach(async () => {
    await repositorio.clear();
    await repositorioMovimientoInventario.clear();
    await repositorioProducto.clear();
    await repositorioPais.clear();
    await repositorioCategoria.clear();
    await repositorioMarca.clear();
    await repositorioUnidadMedida.clear();
    await repositorioUbicacion.clear();
    await repositorioBodega.clear();
  });

  it('deberia obtener productos con inventario', async () => {
    await poblarBaseDeDatos(true);
    const producto = faker.helpers.arrayElement(productosConInventario);
    const longitudSubstring = Math.min(
      faker.number.int({ min: 1, max: 5 }),
      producto.nombre.length - 1,
    );
    const substring = producto.nombre.substring(0, longitudSubstring);
    const productosQueTienenSubstring = productosConInventario.filter((p) =>
      p.nombre.toLowerCase().includes(substring.toLowerCase()),
    );
    const matchProductos = await service.obtenerInventarioDeProductos({
      nombre_producto: substring,
    });
    expect(matchProductos.length).toEqual(productosQueTienenSubstring.length);
    matchProductos.forEach((p: ProductoConInventarioDto) => {
      const productoCreado = productosConInventario.find(
        (pc: ProductoPreCreado) => pc.id === p.id_producto,
      );
      expect(productoCreado?.inventario).toEqual(p.inventario);
      expect(productoCreado?.nombre).toEqual(p.nombre);
      expect(productoCreado?.id).toEqual(p.id_producto);
    });
  });

  it('no deberia obtener productos sin inventario', async () => {
    await poblarBaseDeDatos(false);
    const producto = faker.helpers.arrayElement(productosSinInventario);
    const longitudSubstring = Math.min(
      faker.number.int({ min: 1, max: 5 }),
      producto.nombre.length - 1,
    );
    const substring = producto.nombre.substring(0, longitudSubstring);
    const matchProductos = await service.obtenerInventarioDeProductos({
      nombre_producto: substring,
    });
    expect(matchProductos.length).toEqual(0);
  });
});
