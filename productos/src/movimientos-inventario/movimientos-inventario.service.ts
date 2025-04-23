import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEntradaInventarioDto } from './dto/create-entrada-invenario.dto';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventariosService } from '../inventarios/inventarios.service';
import { ProductosService } from '../productos/productos.service';
import { UbicacionesService } from '../ubicaciones/ubicaciones.service';
import { TipoMovimientoEnum } from './enums/tipo-movimiento.enum';
import { CreatePreReservaInventarioDto } from './dto/create-pre-reserva-inventario.dto';
@Injectable()
export class MovimientosInventarioService {
  constructor(
    @InjectRepository(MovimientoInventarioEntity)
    private readonly repositorio: Repository<MovimientoInventarioEntity>,
    private readonly inventarioService: InventariosService,
    private readonly productoService: ProductosService,
    private readonly ubicacionService: UbicacionesService,
    private readonly dataSource: DataSource,
  ) {}
  async generarEntradaInventario(
    crearEntradaInventario: CreateEntradaInventarioDto,
  ) {
    const ubicacion = await this.ubicacionService.obtenerUbicacion(
      crearEntradaInventario.idUbicacion,
    );
    const producto = await this.productoService.obtenerProducto(
      crearEntradaInventario.idProducto,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movimientoInventarioCreado = this.repositorio.create({
        ...crearEntradaInventario,
        tipo_movimiento: TipoMovimientoEnum.ENTRADA,
        id_usuario: crearEntradaInventario.idUsuario,
        fecha_registro: crearEntradaInventario.fechaRegistro,
        ubicacion: ubicacion,
        producto: producto,
      });

      const movimientoInventarioGuardado = await queryRunner.manager.save(
        MovimientoInventarioEntity,
        movimientoInventarioCreado,
      );

      await this.inventarioService.actualizarInventarioDeProducto(
        crearEntradaInventario.idProducto,
        TipoMovimientoEnum.ENTRADA,
        ubicacion,
        crearEntradaInventario.cantidad,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return this.repositorio.findOne({
        where: { id_movimiento: movimientoInventarioGuardado.id_movimiento },
        relations: ['ubicacion', 'producto'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async generarPreReservaInventario(
    crearPreReservaInventario: CreatePreReservaInventarioDto,
  ) {
    const inventariosEnUbicaciones =
      await this.inventarioService.obtenerInventarioPorUbicacionesDeProductoPorIdProducto(
        crearPreReservaInventario.idProducto,
      );
    const cantidadEnInventario = inventariosEnUbicaciones.reduce(
      (acumulado, inventario) => acumulado + inventario.cantidad_disponible,
      0,
    );
    const cantidadPreReservada = crearPreReservaInventario.cantidad;
    if (cantidadEnInventario < cantidadPreReservada) {
      throw new BadRequestException(
        'No hay suficiente cantidad en inventario para realizar esta operación',
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let cantidadRestante = cantidadPreReservada;
      for (const inventario of inventariosEnUbicaciones) {
        const cantidadDisponible = inventario.cantidad_disponible;
        if (cantidadRestante > 0) {
          const cantidadAReservar = Math.min(
            cantidadRestante,
            cantidadDisponible,
          );

          const movimientoInventarioCreado = this.repositorio.create({
            cantidad: cantidadAReservar,
            id_pedido: crearPreReservaInventario.idPedido,
            tipo_movimiento: TipoMovimientoEnum.PRE_RESERVA,
            id_usuario: crearPreReservaInventario.idUsuario,
            fecha_registro: crearPreReservaInventario.fechaRegistro,
            ubicacion: inventario.ubicacion,
            producto: inventario.producto,
          });

          await queryRunner.manager.save(
            MovimientoInventarioEntity,
            movimientoInventarioCreado,
          );

          await this.inventarioService.actualizarInventarioDeProducto(
            crearPreReservaInventario.idProducto,
            TipoMovimientoEnum.PRE_RESERVA,
            inventario.ubicacion,
            cantidadAReservar,
            queryRunner.manager,
          );
          cantidadRestante -= cantidadAReservar;
        }
      }
      await queryRunner.commitTransaction();
      return this.repositorio.find({
        where: {
          id_pedido: crearPreReservaInventario.idPedido,
        },
        relations: ['ubicacion', 'producto'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
