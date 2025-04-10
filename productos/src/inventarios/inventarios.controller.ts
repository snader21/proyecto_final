import { Controller, Get, Query } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { QueryInventarioDto } from './dto/query-inventario.dto';

@Controller('inventarios')
export class InventariosController {
  constructor(private readonly inventariosService: InventariosService) {}

  @Get()
  async obtenerInventario(@Query() query: QueryInventarioDto) {
    return this.inventariosService.obtenerInventarioDeProductos(query);
  }
}
