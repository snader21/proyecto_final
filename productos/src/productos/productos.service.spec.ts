import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { PaisEntity } from './entities/pais.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { FileGCP } from './utils/file-gcp.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PubSubService } from '../common/services/pubsub.service';

describe('ProductosService', () => {
  let service: ProductosService;
  let productoRepository: Repository<ProductoEntity>;
  let categoriaRepository: Repository<CategoriaEntity>;
  let marcaRepository: Repository<MarcaEntity>;
  let unidadMedidaRepository: Repository<UnidadMedidaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let imagenProductoRepository: Repository<ImagenProductoEntity>;
  let archivoProductoRepository: Repository<ArchivoProductoEntity>;
  let fileGcpService: FileGCP;
  let pubSubService: PubSubService;

  let productosList: ProductoEntity[];
  let categoriasList: CategoriaEntity[];
  let marcasList: MarcaEntity[];
  let unidadesMedidaList: UnidadMedidaEntity[];
  let paisesList: PaisEntity[];

  const mockFileGCP = {
    save: jest.fn(),
    listFiles: jest.fn(),
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockPubSubService = {
    publishMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        ProductosService,
        { provide: FileGCP, useValue: mockFileGCP },
        { provide: PubSubService, useValue: mockPubSubService },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    marcaRepository = module.get<Repository<MarcaEntity>>(
      getRepositoryToken(MarcaEntity),
    );
    unidadMedidaRepository = module.get<Repository<UnidadMedidaEntity>>(
      getRepositoryToken(UnidadMedidaEntity),
    );
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    imagenProductoRepository = module.get<Repository<ImagenProductoEntity>>(
      getRepositoryToken(ImagenProductoEntity),
    );
    archivoProductoRepository = module.get<Repository<ArchivoProductoEntity>>(
      getRepositoryToken(ArchivoProductoEntity),
    );
    fileGcpService = module.get<FileGCP>(FileGCP);
    pubSubService = module.get<PubSubService>(PubSubService);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await productoRepository.clear();
    await categoriaRepository.clear();
    await marcaRepository.clear();
    await unidadMedidaRepository.clear();
    await paisRepository.clear();

    productosList = [];
    categoriasList = [];
    marcasList = [];
    unidadesMedidaList = [];
    paisesList = [];

    // Crear países
    const pais1 = await paisRepository.save({
      id_pais: faker.string.uuid(),
      nombre: 'Colombia',
      abreviatura: 'COL',
      moneda: 'COP',
      iva: 19.0,
    });
    const pais2 = await paisRepository.save({
      id_pais: faker.string.uuid(),
      nombre: 'Estados Unidos',
      abreviatura: 'US',
      moneda: 'USD',
      iva: 0.0,
    });
    paisesList.push(pais1, pais2);

    // Crear categorías
    const categoria1 = await categoriaRepository.save({
      id_categoria: faker.string.uuid(),
      nombre: 'Electrónica',
      descripcion: 'Productos electrónicos',
    });
    const categoria2 = await categoriaRepository.save({
      id_categoria: faker.string.uuid(),
      nombre: 'Alimentos',
      descripcion: 'Productos alimenticios',
    });
    categoriasList.push(categoria1, categoria2);

    // Crear marcas
    const marca1 = await marcaRepository.save({
      id_marca: faker.string.uuid(),
      nombre: 'Samsung',
      descripcion: 'Tecnología coreana',
    });
    const marca2 = await marcaRepository.save({
      id_marca: faker.string.uuid(),
      nombre: 'Nestlé',
      descripcion: 'Alimentos suizos',
    });
    marcasList.push(marca1, marca2);

    // Crear unidades de medida
    const unidad1 = await unidadMedidaRepository.save({
      id_unidad_medida: faker.string.uuid(),
      nombre: 'Unidad',
      abreviatura: 'UN',
    });
    const unidad2 = await unidadMedidaRepository.save({
      id_unidad_medida: faker.string.uuid(),
      nombre: 'Kilogramo',
      abreviatura: 'KG',
    });
    unidadesMedidaList.push(unidad1, unidad2);

    // Crear productos
    for (let i = 0; i < 5; i++) {
      const producto = await productoRepository.save({
        id_producto: faker.string.uuid(),
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        sku: faker.string.alphanumeric(10),
        codigo_barras: faker.string.numeric(13),
        precio: parseFloat(faker.commerce.price()),
        activo: true,
        alto: faker.number.int({ min: 1, max: 100 }),
        ancho: faker.number.int({ min: 1, max: 100 }),
        largo: faker.number.int({ min: 1, max: 100 }),
        peso: faker.number.int({ min: 1, max: 10 }),
        id_fabricante: faker.string.alphanumeric(5),
        categoria: categoriasList[i % 2],
        marca: marcasList[i % 2],
        unidad_medida: unidadesMedidaList[i % 2],
        pais: paisesList[i % 2],
        fecha_creacion: new Date('2025-04-05T17:40:54-05:00'),
        fecha_actualizacion: new Date('2025-04-05T17:40:54-05:00'),
      });
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerProductos', () => {
    it('should return all products', async () => {
      const productos = await service.obtenerProductos();
      expect(productos).not.toBeNull();
      expect(productos).toHaveLength(productosList.length);
    });
  });

  describe('obtenerProducto', () => {
    it('should return a product by id', async () => {
      const storedProduct = productosList[0];
      const producto = await service.obtenerProducto(storedProduct.id_producto);
      expect(producto).not.toBeNull();
      expect(producto.nombre).toEqual(storedProduct.nombre);
      expect(producto.sku).toEqual(storedProduct.sku);
    });

    it('should throw an exception for an invalid product', async () => {
      await expect(service.obtenerProducto('0')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('obtenerCategorias', () => {
    it('should return all categories', async () => {
      const categorias = await service.obtenerCategorias();
      expect(categorias).not.toBeNull();
      expect(categorias).toHaveLength(categoriasList.length);
    });
  });

  describe('obtenerMarcas', () => {
    it('should return all brands', async () => {
      const marcas = await service.obtenerMarcas();
      expect(marcas).not.toBeNull();
      expect(marcas).toHaveLength(marcasList.length);
    });
  });

  describe('obtenerUnidadesMedida', () => {
    it('should return all measurement units', async () => {
      const unidades = await service.obtenerUnidadesMedida();
      expect(unidades).not.toBeNull();
      expect(unidades).toHaveLength(unidadesMedidaList.length);
    });
  });

  describe('GuardarProducto', () => {
    it('should create a new product', async () => {
      const producto: ProductoEntity = {
        id_producto: '',
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        sku: faker.string.alphanumeric(10),
        codigo_barras: faker.string.numeric(13),
        precio: parseFloat(faker.commerce.price()),
        activo: true,
        alto: faker.number.int({ min: 1, max: 100 }),
        ancho: faker.number.int({ min: 1, max: 100 }),
        largo: faker.number.int({ min: 1, max: 100 }),
        peso: faker.number.float({ min: 0.1, max: 100, fractionDigits: 1 }),
        id_fabricante: `FAB-${faker.string.alphanumeric(5)}`,
        fecha_creacion: new Date('2025-04-05T17:40:54-05:00'),
        fecha_actualizacion: new Date('2025-04-05T17:40:54-05:00'),
        categoria: categoriasList[0],
        marca: marcasList[0],
        unidad_medida: unidadesMedidaList[0],
        pais: paisesList[0],
        imagenes: [],
        movimientos_inventario: [],
      };

      mockFileGCP.save.mockResolvedValue('http://test.com/test.jpg');

      const newProduct = await service.GuardarProducto(producto, []);
      expect(newProduct).not.toBeNull();

      const storedProduct = await productoRepository.findOne({
        where: { id_producto: newProduct.id_producto },
        relations: ['categoria', 'marca', 'unidad_medida', 'pais'],
      });
      expect(storedProduct).not.toBeNull();
      expect(storedProduct?.nombre).toEqual(newProduct.nombre);
    });
  });

  describe('guardarArchivoCSV', () => {
    it('should save a CSV file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from('test'),
        size: 4,
      };

      mockFileGCP.save.mockResolvedValue('http://test.com/test.csv');

      const result = await service.guardarArchivoCSV(mockFile);
      expect(result).not.toBeNull();
      expect(result.url).toEqual('http://test.com/test.csv');
    });
  });

  describe('obtenerArchivosCSV', () => {
    it('should return all CSV files', async () => {
      const archivo = await archivoProductoRepository.save({
        nombre_archivo: 'test.csv',
        url: 'http://test.com/test.csv',
        estado: 'pendiente',
        fecha_carga: new Date(),
      });

      const archivos = await service.obtenerArchivosCSV();
      expect(archivos).not.toBeNull();
      expect(archivos.length).toBeGreaterThan(0);
    });
  });
});
