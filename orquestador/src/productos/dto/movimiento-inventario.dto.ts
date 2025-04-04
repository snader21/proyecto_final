export class MovimientoInventarioDto {
  id_movimiento: string;
  id_pedido?: string;
  cantidad: number;
  tipo_movimiento: string;
  fecha_registro: string;
  id_usuario: string;
  producto: ProductoDto;
  ubicacion: UbicacionDto;
}

class ProductoDto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  sku: string;
  precio: number;
  alto: number;
  largo: number;
  ancho: number;
  peso: number;
}

class UbicacionDto {
  id_ubicacion: string;
  nombre: string;
  descripcion: string;
}
