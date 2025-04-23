import { Test, TestingModule } from '@nestjs/testing';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { InventariosService } from '../inventarios/inventarios.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductosService } from '../productos/productos.service';
import { BodegasService } from '../bodegas/bodegas.service';
import { UbicacionesService } from '../ubicaciones/ubicaciones.service';
import { Repository } from 'typeorm';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
import { ProductoEntity } from '../productos/entities/producto.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
import { InventarioEntity } from '../inventarios/entities/inventario.entity';
import { faker } from '@faker-js/faker';
import { CategoriaEntity } from '../productos/entities/categoria.entity';
import { MarcaEntity } from '../productos/entities/marca.entity';
import { PaisEntity } from '../productos/entities/pais.entity';
import { UnidadMedidaEntity } from '../productos/entities/unidad-medida.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generarEntradaInventarioDto } from '../shared/testing-utils/test-utils';
import { TipoMovimientoEnum } from './enums/tipo-movimiento.enum';
import { NotFoundException } from '@nestjs/common';

let service: MovimientosInventarioService;
let repositorio: Repository<MovimientoInventarioEntity>;
let repositorioProducto: Repository<ProductoEntity>;

let repositorioInventario: Repository<InventarioEntity>;
let repositorioPais: Repository<PaisEntity>;
let repositorioCategoria: Repository<CategoriaEntity>;
let repositorioMarca: Repository<MarcaEntity>;
let repositorioUnidadMedida: Repository<UnidadMedidaEntity>;
let repositorioBodega: Repository<BodegaEntity>;
let repositorioUbicacion: Repository<UbicacionEntity>;

const mockInventarioService = {
  actualizarInventarioDeProducto: jest.fn(),
};

let paisId: string;
const nombrePais = faker.location.country();
const abreviatura = faker.location.countryCode();
const moneda = faker.finance.currencyCode();
const iva = faker.number.int({ min: 0, max: 100 });

let categoriaId: string;
const nombreCategoria = faker.commerce.department();
const descripcionCategoria = faker.commerce.productDescription();

let marcaId: string;
const nombreMarca = faker.company.name();
const descripcionMarca = faker.commerce.productDescription();

let unidadMedidaId: string;
const nombreUnidadMedida = faker.commerce.productAdjective();
const abreviaturaUnidadMedida = faker.string.alpha(2);

let productoId: string;
const nombreProducto = faker.commerce.productName();
const descripcionProducto = faker.commerce.productDescription();
const sku = faker.string.alpha(10);
const codigoBarras = faker.string.numeric(13);
const productoCategoriaId = faker.string.uuid();
const productoMarcaId = faker.string.uuid();
const productoUnidadMedidaId = faker.string.uuid();
const precio = faker.number.int({ min: 1000, max: 100000 });
const activo = true;
const alto = faker.number.int({ min: 1, max: 100 });
const ancho = faker.number.int({ min: 1, max: 100 });
const largo = faker.number.int({ min: 1, max: 100 });
const peso = faker.number.int({ min: 1, max: 100 });
const fechaCreacion = faker.date.recent();
const fechaActualizacion = faker.date.recent();
const idFabricante = faker.string.uuid();
const productoPaisId = faker.string.uuid();
const mockProductoService = {
  obtenerProducto: jest.fn((id: string) => {
    if (id === productoId) {
      return Promise.resolve({
        id_producto: productoId,
        nombre: nombreProducto,
        descripcion: descripcionProducto,
        sku,
        codigo_barras: codigoBarras,
        categoria: { id_categoria: productoCategoriaId },
        marca: { id_marca: productoMarcaId },
        unidad_medida: { id_unidad_medida: productoUnidadMedidaId },
        precio,
        activo,
        alto,
        ancho,
        largo,
        peso,
        fecha_creacion: fechaCreacion,
        fecha_actualizacion: fechaActualizacion,
        id_fabricante: idFabricante,
        pais: { id_pais: productoPaisId },
      });
    }
    return Promise.reject(new NotFoundException('Producto no encontrado'));
  }),
  findAll: jest.fn(),
};

let bodegaId: string;
const nombreBodega = faker.commerce.department();
const direccionBodega = faker.location.streetAddress();
const capacidadBodega = faker.number.int({ min: 1, max: 1000 });
const mockBodegaService = {
  obtenerBodega: jest.fn((id: string) => {
    if (id === bodegaId) {
      return Promise.resolve({
        id_bodega: bodegaId,
        nombre: nombreBodega,
        direccion: direccionBodega,
        capacidad: capacidadBodega,
      });
    }
    return Promise.reject(new NotFoundException('Bodega no encontrada'));
  }),
  findAll: jest.fn(),
};

let ubicacionId: string;
const nombreUbicacion = faker.commerce.department();
const descripcionUbicacion = faker.commerce.productDescription();
const tipoUbicacion = faker.commerce.productAdjective();
const mockUbicacionService = {
  obtenerUbicacion: jest.fn((id: string) => {
    if (id === ubicacionId) {
      return Promise.resolve({
        id_ubicacion: ubicacionId,
        nombre: nombreUbicacion,
        descripcion: descripcionUbicacion,
        tipo: tipoUbicacion,
      });
    }
    return Promise.reject(new NotFoundException('Ubicación no encontrada'));
  }),
  findAll: jest.fn(),
};

const poblarBaseDeDatos = async () => {
  const entidadPais = await repositorioPais.save({
    nombre: nombrePais,
    abreviatura,
    moneda,
    iva,
  });
  paisId = entidadPais.id_pais;

  const entidadCategoria = await repositorioCategoria.save({
    nombre: nombreCategoria,
    descripcion: descripcionCategoria,
  });
  categoriaId = entidadCategoria.id_categoria;

  const entidadMarca = await repositorioMarca.save({
    nombre: nombreMarca,
    descripcion: descripcionMarca,
  });
  marcaId = entidadMarca.id_marca;

  const entidadUnidadMedida = await repositorioUnidadMedida.save({
    nombre: nombreUnidadMedida,
    abreviatura: abreviaturaUnidadMedida,
  });
  unidadMedidaId = entidadUnidadMedida.id_unidad_medida;

  const entidadProducto = await repositorioProducto.save({
    nombre: nombreProducto,
    descripcion: descripcionProducto,
    sku,
    codigo_barras: codigoBarras,
    categoria: { id_categoria: categoriaId },
    marca: { id_marca: marcaId },
    unidad_medida: { id_unidad_medida: unidadMedidaId },
    precio,
    activo,
    alto,
    ancho,
    largo,
    peso,
    fecha_creacion: fechaCreacion,
    fecha_actualizacion: fechaActualizacion,
    id_fabricante: idFabricante,
    pais: { id_pais: paisId },
  });
  productoId = entidadProducto.id_producto;

  const entidadBodega = await repositorioBodega.save({
    nombre: nombreBodega,
    direccion: direccionBodega,
    capacidad: capacidadBodega,
  });
  bodegaId = entidadBodega.id_bodega;

  const entidadUbicacion = await repositorioUbicacion.save({
    nombre: nombreUbicacion,
    descripcion: descripcionUbicacion,
    tipo: tipoUbicacion,
    bodega: { id_bodega: bodegaId },
  });
  ubicacionId = entidadUbicacion.id_ubicacion;
};

describe('Pruebas con servicio de inventario real', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        MovimientosInventarioService,
        InventariosService,
        { provide: ProductosService, useValue: mockProductoService },
        { provide: BodegasService, useValue: mockBodegaService },
        { provide: UbicacionesService, useValue: mockUbicacionService },
      ],
    }).compile();

    service = module.get<MovimientosInventarioService>(
      MovimientosInventarioService,
    );
    repositorio = module.get<Repository<MovimientoInventarioEntity>>(
      getRepositoryToken(MovimientoInventarioEntity),
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
    repositorioInventario = module.get<Repository<InventarioEntity>>(
      getRepositoryToken(InventarioEntity),
    );
    await poblarBaseDeDatos();
  });

  afterEach(async () => {
    await repositorio.clear();
    await repositorioInventario.clear();
    await repositorioProducto.clear();
    await repositorioPais.clear();
    await repositorioCategoria.clear();
    await repositorioMarca.clear();
    await repositorioUnidadMedida.clear();
    await repositorioUbicacion.clear();
    await repositorioBodega.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('no deberia crear un movimiento de inventario si la ubicacion no existe', async () => {
    const dto = generarEntradaInventarioDto(productoId, faker.string.uuid());
    await expect(service.generarEntradaInventario(dto)).rejects.toThrow(
      'Ubicación no encontrada',
    );
  });

  it('no deberia crear un movimiento de inventario si el producto no existe', async () => {
    const dto = generarEntradaInventarioDto(faker.string.uuid(), ubicacionId);
    await expect(service.generarEntradaInventario(dto)).rejects.toThrow(
      'Producto no encontrado',
    );
  });

  it('deberia crear un movimiento de inventario correctamente y a su vez crear el inventario del producto si no existe el producto en el inventario', async () => {
    const dto = generarEntradaInventarioDto(productoId, ubicacionId);
    const movimiento = await service.generarEntradaInventario(dto);
    const inventario = await repositorioInventario.findOne({
      where: { producto: { id_producto: productoId } },
    });
    expect(inventario).toBeDefined();
    expect(inventario?.cantidad_disponible).toBe(dto.cantidad);
    expect(movimiento).toBeDefined();
    expect(movimiento?.cantidad).toBe(dto.cantidad);
    expect(movimiento?.ubicacion?.id_ubicacion).toBe(dto.idUbicacion);
    expect(movimiento?.producto?.id_producto).toBe(dto.idProducto);
    expect(movimiento?.fecha_registro).toBe(dto.fechaRegistro);
    expect(movimiento?.id_usuario).toBe(dto.idUsuario);
  });
});

describe('Pruebas con servicio de inventario mock', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        MovimientosInventarioService,
        { provide: InventariosService, useValue: mockInventarioService },
        { provide: ProductosService, useValue: mockProductoService },
        { provide: BodegasService, useValue: mockBodegaService },
        { provide: UbicacionesService, useValue: mockUbicacionService },
      ],
    }).compile();

    service = module.get<MovimientosInventarioService>(
      MovimientosInventarioService,
    );
    repositorio = module.get<Repository<MovimientoInventarioEntity>>(
      getRepositoryToken(MovimientoInventarioEntity),
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
    repositorioInventario = module.get<Repository<InventarioEntity>>(
      getRepositoryToken(InventarioEntity),
    );
    await poblarBaseDeDatos();
  });

  afterEach(async () => {
    await repositorio.clear();
    await repositorioInventario.clear();
    await repositorioProducto.clear();
    await repositorioPais.clear();
    await repositorioCategoria.clear();
    await repositorioMarca.clear();
    await repositorioUnidadMedida.clear();
    await repositorioUbicacion.clear();
    await repositorioBodega.clear();
  });

  it('no deberia crear un movimiento de inventario si la actualización del inventario genera un error', async () => {
    const dto = generarEntradaInventarioDto(productoId, ubicacionId);

    mockInventarioService.actualizarInventarioDeProducto.mockRejectedValueOnce(
      new Error('Error al actualizar el inventario'),
    );

    await expect(service.generarEntradaInventario(dto)).rejects.toThrow(
      'Error al actualizar el inventario',
    );

    const movimientos = await repositorio.find({
      where: {
        cantidad: dto.cantidad,
      },
    });
    expect(movimientos.length).toBe(0);
  });
});
