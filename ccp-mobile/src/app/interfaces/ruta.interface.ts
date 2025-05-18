export interface NodoRuta {
  id: number;
  numero_nodo_programado: number;
  numero_nodo_final: number | null;
  latitud: string;
  longitud: string;
  direccion: string;
  id_cliente: string | null;
  id_pedido: string | null;
  id_bodega: string | null;
  hora_llegada: string;
  hora_salida: string;
}

export interface TipoRuta {
  id: string;
  tipo_ruta: string;
}

export interface EstadoRuta {
  id: string;
  estado_ruta: string;
}

export interface Camion {
  id: string;
  placa: string;
  nombre_conductor: string;
  celular_conductor: string;
  capacidad: number;
}

export interface Ruta {
  id: string;
  numero_ruta: number;
  fecha: string;
  duracion_estimada: number;
  duracion_final: number | null;
  distancia_total: number;
  vendedor_id: string | null;
  tipo_ruta: TipoRuta;
  estado_ruta: EstadoRuta;
  camion: Camion;
  nodos_rutas: NodoRuta[];
}
