import { Controller, Post, Body } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('movimientos-inventario')
  async crearMovimientoInventario(@Body() dto: CreateMovimientoInventarioDto) {
    return this.productosService.crearMovimientoInventario(dto);
  }
}
