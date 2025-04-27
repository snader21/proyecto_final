import { Producto } from './producto.interface';

export interface ProductoPedido extends Producto {
  cantidad_seleccionada: number;
}
