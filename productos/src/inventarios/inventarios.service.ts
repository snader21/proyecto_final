import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { InventarioEntity } from './entities/inventario.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { TipoMovimientoEnum } from '../movimientos-inventario/enums/tipo-movimiento.enum';
import { QueryInventarioDto } from './dto/query-inventario.dto';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
@Injectable()
export class InventariosService {
  constructor(
    @InjectRepository(InventarioEntity)
    private readonly repositorio: Repository<InventarioEntity>,
    @InjectRepository(UbicacionEntity)
    private readonly ubicacionRepositorio: Repository<UbicacionEntity>,
  ) {}

  async obtenerInventarioTotalDeProductosPorQueryDto(
    query: QueryInventarioDto,
  ): Promise<any[]> {
    const operadorLike = process.env.NODE_ENV === 'test' ? 'LIKE' : 'ILIKE';
    return this.repositorio
      .createQueryBuilder('inventario')
      .leftJoin('inventario.producto', 'producto')
      .where('producto.nombre ' + operadorLike + ' :nombre', {
        nombre: `%${query.nombre_producto}%`,
      })
      .andWhere('inventario.cantidad_disponible > 0')
      .select([
        'producto.id_producto as id_producto',
        'producto.precio as precio',
        'producto.nombre as nombre',
        'SUM(inventario.cantidad_disponible) AS inventario',
      ])
      .groupBy('producto.id_producto')
      .getRawMany();
  }

  async obtenerInventarioProductoConUbicaciones(
    nombreProducto: string,
  ): Promise<any[]> {
    const operadorLike = process.env.NODE_ENV === 'test' ? 'LIKE' : 'ILIKE';

    // Primero obtenemos los productos que coinciden con el nombre
    const productos = await this.repositorio
      .createQueryBuilder('inventario')
      .leftJoin('inventario.producto', 'producto')
      .where('producto.nombre ' + operadorLike + ' :nombre', {
        nombre: `%${nombreProducto}%`,
      })
      .select([
        'DISTINCT producto.id_producto as id_producto',
        'producto.nombre as nombre',
        'producto.descripcion as descripcion',
        'producto.sku as sku',
        'producto.codigo_barras as codigo_barras',
        'producto.precio as precio',
        'producto.activo as activo',
        'producto.alto as alto',
        'producto.ancho as ancho',
        'producto.largo as largo',
        'producto.peso as peso',
        'producto.fecha_creacion as fecha_creacion',
        'producto.fecha_actualizacion as fecha_actualizacion',
        'producto.id_fabricante as id_fabricante',
        'producto.id_categoria as id_categoria',
        'producto.id_marca as id_marca',
        'producto.id_unidad_medida as id_unidad_medida',
        'producto.id_pais as id_pais'
      ])
      .getRawMany();

    if (productos.length === 0) {
      return [];
    }

    // Primero obtenemos las bodegas que tienen el producto
    const bodegasConProducto = await this.repositorio
      .createQueryBuilder('inventario')
      .innerJoin('inventario.producto', 'producto')
      .innerJoin('inventario.ubicacion', 'ubicacion')
      .innerJoin('ubicacion.bodega', 'bodega')
      .where('producto.nombre ' + operadorLike + ' :nombre', {
        nombre: `%${nombreProducto}%`,
      })
      .select('DISTINCT bodega.id_bodega', 'id_bodega')
      .getRawMany();

    if (bodegasConProducto.length === 0) return [];

    // Ahora obtenemos TODAS las ubicaciones de esas bodegas
    const bodegas = await this.ubicacionRepositorio
      .createQueryBuilder('ubicacion')
      .leftJoin('ubicacion.bodega', 'bodega')
      .where('bodega.id_bodega IN (:...bodegasIds)', {
        bodegasIds: bodegasConProducto.map(b => b.id_bodega)
      })
      .select([
        'bodega.id_bodega as id_bodega',
        'bodega.nombre as nombre_bodega',
        'ubicacion.id_ubicacion as id_ubicacion',
        'ubicacion.nombre as nombre_ubicacion',
        'ubicacion.descripcion as descripcion_ubicacion'
      ])
      .getRawMany();

    // Obtenemos el inventario existente
    const inventarios = await this.repositorio
      .createQueryBuilder('inventario')
      .leftJoin('inventario.producto', 'producto')
      .leftJoin('inventario.ubicacion', 'ubicacion')
      .where('producto.nombre ' + operadorLike + ' :nombre', {
        nombre: `%${nombreProducto}%`,
      })
      .andWhere('inventario.cantidad_disponible > 0')
      .select([
        'producto.id_producto as id_producto',
        'ubicacion.id_ubicacion as id_ubicacion',
        'inventario.cantidad_disponible as cantidad_disponible'
      ])
      .getRawMany();

    // Creamos un mapa de inventario por ubicación y producto
    const inventarioMap = new Map();
    for (const inv of inventarios) {
      const key = `${inv.id_producto}_${inv.id_ubicacion}`;
      inventarioMap.set(key, inv.cantidad_disponible);
    }

    // Agrupamos las bodegas por ID
    const bodegasMap = new Map();
    for (const bodega of bodegas) {
      if (!bodegasMap.has(bodega.id_bodega)) {
        bodegasMap.set(bodega.id_bodega, {
          id_bodega: bodega.id_bodega,
          nombre: bodega.nombre_bodega,
          ubicaciones: []
        });
      }
      const bodegaData = bodegasMap.get(bodega.id_bodega);
      if (bodega.id_ubicacion) { // Solo agregamos si la ubicación existe
        bodegaData.ubicaciones.push({
          id_ubicacion: bodega.id_ubicacion,
          nombre: bodega.nombre_ubicacion,
          descripcion: bodega.descripcion_ubicacion
        });
      }
    }

    // Construimos la respuesta final
    return productos.map(producto => {
      const bodegasProducto = Array.from(bodegasMap.values()).map(bodega => ({
        ...bodega,
        ubicaciones: bodega.ubicaciones.map(ubicacion => {
          const cantidadDisponible = inventarioMap.get(`${producto.id_producto}_${ubicacion.id_ubicacion}`) || 0;
          return {
            ...ubicacion,
            cantidad_disponible: cantidadDisponible,
            tiene_inventario: cantidadDisponible > 0
          };
        })
      }));

      return {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        sku: producto.sku,
        codigo_barras: producto.codigo_barras,
        precio: producto.precio,
        activo: producto.activo,
        alto: producto.alto,
        ancho: producto.ancho,
        largo: producto.largo,
        peso: producto.peso,
        fecha_creacion: producto.fecha_creacion,
        fecha_actualizacion: producto.fecha_actualizacion,
        id_fabricante: producto.id_fabricante,
        id_categoria: producto.id_categoria,
        id_marca: producto.id_marca,
        id_unidad_medida: producto.id_unidad_medida,
        id_pais: producto.id_pais,
        bodegas: bodegasProducto
      };
    });
  }

  async obtenerInventarioPorUbicacionesDeProductoPorIdProducto(
    idProducto: string,
  ): Promise<InventarioEntity[]> {
    return this.repositorio.find({
      where: {
        producto: { id_producto: idProducto },
        cantidad_disponible: MoreThan(0),
      },
      relations: ['ubicacion', 'producto'],
      order: { cantidad_disponible: 'DESC' },
    });
  }

  async obtenerInventarioDeProductoEnBodega(
    idProducto: string,
    idUbicacion: string,
  ): Promise<InventarioEntity | null> {
    const inventario = await this.repositorio.findOne({
      where: {
        producto: { id_producto: idProducto },
        ubicacion: { id_ubicacion: idUbicacion },
      },
    });
    return inventario;
  }

  async actualizarInventarioDeProducto(
    idProducto: string,
    tipoMovimiento: TipoMovimientoEnum,
    ubicacion: UbicacionEntity,
    cantidad: number,
    manager: EntityManager,
  ): Promise<InventarioEntity> {
    let inventario = await this.obtenerInventarioDeProductoEnBodega(
      idProducto,
      ubicacion.id_ubicacion,
    );

    if (!inventario) {
      inventario = await manager.save(InventarioEntity, {
        producto: { id_producto: idProducto },
        ubicacion: { id_ubicacion: ubicacion.id_ubicacion },
        cantidad_disponible: 0,
        cantidad_minima: 0,
        cantidad_maxima: 1000,
        fecha_actualizacion: new Date(),
      });
    }

    if (tipoMovimiento === TipoMovimientoEnum.ENTRADA) {
      inventario.cantidad_disponible += cantidad;
    } else if (tipoMovimiento === TipoMovimientoEnum.PRE_RESERVA) {
      if (inventario.cantidad_disponible < cantidad) {
        throw new BadRequestException(
          'Stock insuficiente para la pre-reserva solicitada',
        );
      }
      inventario.cantidad_disponible -= cantidad;
    }

    inventario.fecha_actualizacion = new Date();
    return manager.save(InventarioEntity, inventario);
  }
}
