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

export interface Product extends Omit<CreateProduct, 'categoria' | 'marca' | 'unidad_medida' | 'pais'> {
  id_producto: string;
  categoria: Category;
  marca: Brand;
  unidad_medida: Unit;
  pais: {
    id_pais: string;
  };
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}
