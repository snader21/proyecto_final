import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-invenario.dto';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventariosService } from '../inventarios/inventarios.service';
import { ProductosService } from '../productos/productos.service';
import { UbicacionesService } from '../ubicaciones/ubicaciones.service';
import { TipoMovimientoEnum } from './enums/tipo-movimiento.enum';
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
  async crearMovimientoInventario(
    movimientoInventario: CreateMovimientoInventarioDto,
  ) {
    if (
      movimientoInventario.idPedido &&
      movimientoInventario.tipoMovimiento === TipoMovimientoEnum.ENTRADA
    ) {
      throw new BadRequestException(
        'Para movimientos de tipo entrada no debe enviarse un número de pedido',
      );
    }

    if (
      !movimientoInventario.idPedido &&
      movimientoInventario.tipoMovimiento === TipoMovimientoEnum.SALIDA
    ) {
      throw new BadRequestException(
        'Para movimientos de tipo salida debe enviarse un número de pedido',
      );
    }

    const ubicacion = await this.ubicacionService.obtenerUbicacion(
      movimientoInventario.idUbicacion,
    );
    const producto = await this.productoService.obtenerProducto(
      movimientoInventario.idProducto,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movimientoInventarioCreado = this.repositorio.create({
        ...movimientoInventario,
        tipo_movimiento: movimientoInventario.tipoMovimiento,
        id_pedido: movimientoInventario.idPedido,
        id_usuario: movimientoInventario.idUsuario,
        fecha_registro: movimientoInventario.fechaRegistro,
        ubicacion: ubicacion,
        producto: producto,
      });

      const movimientoInventarioGuardado = await queryRunner.manager.save(
        MovimientoInventarioEntity,
        movimientoInventarioCreado,
      );

      await this.inventarioService.actualizarInventarioDeProducto(
        movimientoInventario.idProducto,
        movimientoInventario.tipoMovimiento,
        ubicacion,
        movimientoInventario.cantidad,
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
}
