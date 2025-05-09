import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, MoreThan, Repository } from 'typeorm';
import { InventarioEntity } from './entities/inventario.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { TipoMovimientoEnum } from '../movimientos-inventario/enums/tipo-movimiento.enum';
import { QueryInventarioDto } from './dto/query-inventario.dto';
@Injectable()
export class InventariosService {
  constructor(
    @InjectRepository(InventarioEntity)
    private readonly repositorio: Repository<InventarioEntity>,
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
