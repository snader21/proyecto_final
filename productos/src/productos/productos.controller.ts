import { Controller, Get, Param } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductoPorPedidoDto } from './dto/producto-por-pedido.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get(':idPedido')
  async obtenerProductosPorPedido(@Param('idPedido') idPedido: string): Promise<ProductoPorPedidoDto[]> {
    return this.productosService.obtenerProductosPorPedido(idPedido);
  }
}
