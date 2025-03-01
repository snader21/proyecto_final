import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
import { ProductoPorPedidoDto } from './dto/producto-por-pedido.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(MovimientoInventarioEntity)
    private readonly movimientoInventarioRepository: Repository<MovimientoInventarioEntity>
  ) {}

  async obtenerProductosPorPedido(idPedido: string): Promise<ProductoPorPedidoDto[]> {
    const productosConPedido = await this.movimientoInventarioRepository
      .createQueryBuilder('movimiento')
      .innerJoinAndSelect('movimiento.producto', 'producto')
      .where('movimiento.id_pedido = :idPedido', { idPedido })
      .select([
        'producto.id_producto',
        'producto.nombre',
        'producto.descripcion',
        'producto.sku',
        'producto.precio',
        'producto.alto',
        'producto.largo',
        'producto.ancho',
        'producto.peso',
        'movimiento.cantidad',
      ])
      .getMany();

      const productosDto: ProductoPorPedidoDto[] = productosConPedido.map((movimiento) => {
        return {
          id_producto: movimiento.producto.id_producto,
          nombre: movimiento.producto.nombre,
          descripcion: movimiento.producto.descripcion,
          sku: movimiento.producto.sku,
          precio: movimiento.producto.precio,
          alto: movimiento.producto.alto,
          largo: movimiento.producto.largo,
          ancho: movimiento.producto.ancho,
          peso: movimiento.producto.peso,
          cantidad: movimiento.cantidad,
        };
      });

    return productosDto;
  }
}

