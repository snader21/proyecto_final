import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductoPorPedidoDto } from './dto/producto-por-pedido.dto';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { ProductoEntity } from './entities/producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get('categorias')
  async obtenerCategorias(): Promise<CategoriaEntity[]> {
    return this.productosService.obtenerCategorias();
  }

  @Get('marcas')
  async obtenerMarcas(): Promise<MarcaEntity[]> {
    return this.productosService.obtenerMarcas();
  }

  @Get('unidades-medida')
  async obtenerUnidadesMedida(): Promise<UnidadMedidaEntity[]> {
    return this.productosService.obtenerUnidadesMedida();
  }

  @Get(':idPedido')
  async obtenerProductosPorPedido(@Param('idPedido') idPedido: string): Promise<ProductoPorPedidoDto[]> {
    return this.productosService.obtenerProductosPorPedido(idPedido);
  }

  @Get()
  async obtenerProductos(): Promise<ProductoEntity[]> {
    return this.productosService.obtenerProductos();
  }

  @Post()
  async guardarProducto(@Body() producto: ProductoEntity): Promise<ProductoEntity> {
    return this.productosService.GuardarProducto(producto);
  }
}
