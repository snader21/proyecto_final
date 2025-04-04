import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { InventarioEntity } from './entities/inventario.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { TipoMovimientoEnum } from '../movimientos-inventario/enums/tipo-movimiento.enum';
@Injectable()
export class InventariosService {
  constructor(
    @InjectRepository(InventarioEntity)
    private readonly repositorio: Repository<InventarioEntity>,
  ) {}

  async obtenerInventarioDeProducto(
    idProducto: string,
  ): Promise<InventarioEntity | null> {
    const inventario = await this.repositorio.findOne({
      where: { producto: { id_producto: idProducto } },
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
    let inventario = await this.obtenerInventarioDeProducto(idProducto);

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
    } else {
      if (inventario.cantidad_disponible < cantidad) {
        throw new BadRequestException(
          'Stock insuficiente para la salida solicitada',
        );
      }
      inventario.cantidad_disponible -= cantidad;
    }

    inventario.fecha_actualizacion = new Date();
    return manager.save(InventarioEntity, inventario);
  }
}
