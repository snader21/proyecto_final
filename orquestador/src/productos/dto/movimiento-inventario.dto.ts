export class EntradaInventarioDto {
  id_movimiento: string;
  cantidad: number;
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
