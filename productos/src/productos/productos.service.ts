import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FileGCP } from './utils/file-gcp.service';
import { UploadedFile } from './interfaces/uploaded-file.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { Repository } from 'typeorm';
import { ProductoPorPedidoDto } from './dto/producto-por-pedido.dto';
import { PaisEntity } from './entities/pais.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { MovimientoInventarioEntity } from '../movimientos-inventario/entities/movimiento-inventario.entity';

@Injectable()
export class ProductosService implements OnModuleInit {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(MovimientoInventarioEntity)
    private readonly movimientoInventarioRepository: Repository<MovimientoInventarioEntity>,

    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,

    @InjectRepository(MarcaEntity)
    private readonly marcaRepository: Repository<MarcaEntity>,

    @InjectRepository(UnidadMedidaEntity)
    private readonly unidadMedidaRepository: Repository<UnidadMedidaEntity>,

    @InjectRepository(BodegaEntity)
    private readonly bodegaRepository: Repository<BodegaEntity>,

    @InjectRepository(UbicacionEntity)
    private readonly ubicacionRepository: Repository<UbicacionEntity>,

    @InjectRepository(ImagenProductoEntity)
    private readonly imagenProductoRepository: Repository<ImagenProductoEntity>,

    @InjectRepository(ArchivoProductoEntity)
    private readonly archivoProductoRepository: Repository<ArchivoProductoEntity>,

    private readonly fileGCP: FileGCP,
  ) {}

  async onModuleInit() {
    // Insert data into the Pais table
    await this.paisRepository.insert([
      {
        id_pais: '550e8400-e29b-41d4-a716-446655440000',
        nombre: 'Colombia',
        abreviatura: 'COL',
        moneda: 'COP',
        iva: 19.0,
      },
      {
        id_pais: '550e8400-e29b-41d4-a716-446655440001',
        nombre: 'Estados Unidos',
        abreviatura: 'US',
        moneda: 'USD',
        iva: 0.0,
      },
    ]);

    // Insert data into the Categoria table
    await this.categoriaRepository.insert([
      {
        id_categoria: '550e8400-e29b-41d4-a716-446655440002',
        nombre: 'Electrónica',
        descripcion: 'Productos electrónicos',
        categoria_padre: undefined,
      },
      {
        id_categoria: '550e8400-e29b-41d4-a716-446655440003',
        nombre: 'Celulares',
        descripcion: 'Teléfonos móviles',
        categoria_padre: {
          id_categoria: '550e8400-e29b-41d4-a716-446655440002',
        },
      },
      {
        id_categoria: '550e8400-e29b-41d4-a716-446655440004',
        nombre: 'Computadoras',
        descripcion: 'Computadoras',
        categoria_padre: {
          id_categoria: '550e8400-e29b-41d4-a716-446655440002',
        },
      },
    ]);

    // Insert data into the Marca table
    await this.marcaRepository.insert([
      {
        id_marca: '550e8400-e29b-41d4-a716-446655440004',
        nombre: 'Samsung',
        descripcion: 'Fabricante de productos electrónicos',
      },
      {
        id_marca: '550e8400-e29b-41d4-a716-446655440005',
        nombre: 'Apple',
        descripcion: 'Fabricante de productos electrónicos',
      },
    ]);

    // Insert data into the UnidadMedida table
    await this.unidadMedidaRepository.insert([
      {
        id_unidad_medida: '550e8400-e29b-41d4-a716-446655440006',
        nombre: 'Unidad',
        abreviatura: 'UN',
      },
      {
        id_unidad_medida: '550e8400-e29b-41d4-a716-446655440007',
        nombre: 'Kilogramo',
        abreviatura: 'KG',
      },
    ]);

    // Insert data into the Bodega table
    await this.bodegaRepository.insert([
      {
        id_bodega: '550e8400-e29b-41d4-a716-446655440010',
        nombre: 'Bodega Central',
        direccion: 'Av. Central 123, Ciudad de México',
        capacidad: 100,
      },
      {
        id_bodega: '550e8400-e29b-41d4-a716-446655440011',
        nombre: 'Bodega Norte',
        direccion: 'Calle Norte 456, Monterrey',
        capacidad: 150,
      },
    ]);

    // Insert data into the Ubicacion table
    await this.ubicacionRepository.insert([
      {
        id_ubicacion: '550e8400-e29b-41d4-a716-446655440012',
        bodega: { id_bodega: '550e8400-e29b-41d4-a716-446655440010' },
        nombre: 'Estante 1',
        descripcion: 'Estante para productos electrónicos',
        tipo: 'Estante',
      },
      {
        id_ubicacion: '550e8400-e29b-41d4-a716-446655440013',
        bodega: { id_bodega: '550e8400-e29b-41d4-a716-446655440010' },
        nombre: 'Estante 2',
        descripcion: 'Estante para teléfonos móviles',
        tipo: 'Estante',
      },
      {
        id_ubicacion: '550e8400-e29b-41d4-a716-446655440014',
        bodega: { id_bodega: '550e8400-e29b-41d4-a716-446655440011' },
        nombre: 'Estante 3',
        descripcion: 'Estante para dispositivos de alta gama',
        tipo: 'Estante',
      },
    ]);
  }

  async obtenerProductosPorPedido(
    idPedido: string,
  ): Promise<ProductoPorPedidoDto[]> {
    const productosConPedido = await this.movimientoInventarioRepository
      .createQueryBuilder('movimiento')
      .innerJoinAndSelect('movimiento.producto', 'producto')
      .where('movimiento.id_pedido = :idPedido', { idPedido })
      .select([
        'producto.id_producto',
        'producto.nombre',
        'producto.descripcion',
        'producto.sku',
        'producto.precio',
        'producto.alto',
        'producto.largo',
        'producto.ancho',
        'producto.peso',
        'movimiento.cantidad',
      ])
      .getMany();

    const productosDto: ProductoPorPedidoDto[] = productosConPedido.map(
      (movimiento) => {
        return {
          id_producto: movimiento.producto.id_producto,
          nombre: movimiento.producto.nombre,
          descripcion: movimiento.producto.descripcion,
          sku: movimiento.producto.sku,
          precio: movimiento.producto.precio,
          alto: movimiento.producto.alto,
          largo: movimiento.producto.largo,
          ancho: movimiento.producto.ancho,
          peso: movimiento.producto.peso,
          cantidad: movimiento.cantidad,
        };
      },
    );

    return productosDto;
  }

  async obtenerCategorias(): Promise<CategoriaEntity[]> {
    return await this.categoriaRepository.find();
  }

  async obtenerMarcas(): Promise<MarcaEntity[]> {
    return await this.marcaRepository.find();
  }

  async obtenerUnidadesMedida(): Promise<UnidadMedidaEntity[]> {
    return await this.unidadMedidaRepository.find();
  }

  async GuardarProducto(
    producto: ProductoEntity,
    files: UploadedFile[],
  ): Promise<ProductoEntity> {
    // Save the product first
    const savedProduct = await this.productoRepository.save(producto);

    // Upload images to GCP Storage and save image records
    if (files && files.length > 0) {
      for (const file of files) {
        const fileName = `imagenes/${savedProduct.id_producto}/${file.originalname}`;
        const url = await this.fileGCP.save(file, fileName);

        // Save image record
        await this.imagenProductoRepository.save({
          key_object_storage: fileName,
          url,
          producto: savedProduct,
        });
      }
    }

    return savedProduct;
  }

  async guardarArchivoCSV(file: UploadedFile): Promise<{ url: string }> {
    const fileName = `csvs/${new Date().toISOString()}_${file.originalname}`;
    const url = await this.fileGCP.save(file, fileName);

    // Save file record
    await this.archivoProductoRepository.save({
      nombre_archivo: file.originalname,
      url,
      estado: 'pendiente',
    });

    return { url };
  }

  async obtenerArchivosCSV() {
    return this.archivoProductoRepository.find({
      order: {
        fecha_carga: 'DESC',
      },
    });
  }

  async obtenerProducto(id: string): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id },
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async obtenerProductos(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: {
        categoria: true,
        unidad_medida: true,
        marca: true,
        imagenes: true,
      },
      select: {
        id_producto: true,
        nombre: true,
        descripcion: true,
        sku: true,
        codigo_barras: true,
        precio: true,
        activo: true,
        alto: true,
        ancho: true,
        largo: true,
        peso: true,
        fecha_creacion: true,
        fecha_actualizacion: true,
        id_fabricante: true,
        categoria: {
          id_categoria: true,
          nombre: true,
        },
        unidad_medida: {
          id_unidad_medida: true,
          nombre: true,
        },
        marca: {
          id_marca: true,
          nombre: true,
        },
        imagenes: {
          id_imagen: true,
          url: true,
        },
      },
    });
  }
}
