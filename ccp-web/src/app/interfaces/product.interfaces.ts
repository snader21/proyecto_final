export interface Category {
  id_categoria: string;
  nombre: string;
  code?: string;
}

export interface Brand {
  id_marca: string;
  nombre: string;
  code?: string;
}

export interface Unit {
  id_unidad_medida: string;
  nombre: string;
  code?: string;
}

export interface Maker {
  code: string;
  name: string;
}

export interface Status {
  code: string;
  name: string;
}

export interface CreateProduct {
  nombre: string;
  descripcion: string;
  sku: string;
  codigo_barras?: string;
  categoria: {
    id_categoria: string;
  };
  marca: {
    id_marca: string;
  };
  unidad_medida: {
    id_unidad_medida: string;
  };
  pais: {
    id_pais: string;
  };
  precio: number;
  activo: boolean;
  alto: number;
  ancho: number;
  largo: number;
  peso: number;
  id_fabricante: string;
}

export interface Product {
  id_producto: string;
  nombre: string;
  descripcion: string;
  sku: string;
  categoria?: Category;
  marca?: Brand;
  unidad_medida?: Unit;
  pais?: {
    id_pais: string;
  };
  id_fabricante?: string;
  activo: boolean;
  precio: number;
  alto: number;
  ancho: number;
  largo: number;
  peso: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  imagenes?: {
    url: string;
    id_imagen: string;
  }[];
  measurement?: string;
}

export interface Ubicacion {
  id_ubicacion: string;
  nombre: string;
  descripcion: string;
}

export interface EntradaInventario {
  idProducto: string;
  idUbicacion: string;
  cantidad: number;
  fechaRegistro: Date;
}