import { Controller, Post, Body } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateEntradaInventarioDto } from './dto/create-entrada-invenario.dto';
import { CreatePreReservaInventarioDto } from './dto/create-pre-reserva-inventario.dto';

@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(
    private readonly movimientosInventarioService: MovimientosInventarioService,
  ) {}

  @Post('entradas')
  async agregarProductoAlInventario(
    @Body() movimientoInventario: CreateEntradaInventarioDto,
  ) {
    return this.movimientosInventarioService.generarEntradaInventario(
      movimientoInventario,
    );
  }

  @Post('pre-reservas')
  async preReservarProducto(
    @Body() movimientoInventario: CreatePreReservaInventarioDto,
  ) {
    return this.movimientosInventarioService.generarPreReservaInventario(
      movimientoInventario,
    );
  }
}
