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
    // Revisar que no exista una pre-reserva con el mismo producto y mismo pedido. Si existe, lanzar error
    // Obtener cantidad de productos en inventario por ubicacion (para pre-reservar por ubicacion)
    // Si no existe stock para cubrir la pre-reserva, lanzar error
    // Si existe stock, crear la pre-reserva
    // Actualizar inventario
  }
}
