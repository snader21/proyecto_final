import { Controller, Post, Body } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-invenario.dto';

@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(
    private readonly movimientosInventarioService: MovimientosInventarioService,
  ) {}

  @Post()
  async agregarProductoAlInventario(
    @Body() movimientoInventario: CreateMovimientoInventarioDto,
  ) {
    return this.movimientosInventarioService.crearMovimientoInventario(
      movimientoInventario,
    );
  }
}
