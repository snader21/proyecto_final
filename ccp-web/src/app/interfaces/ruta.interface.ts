export interface Ruta {
  id: string;
  numero_ruta: number;
  fecha: string;
  duracion_estimada: number;
  duracion_final: number;
  distancia_total: number;
  vendedor_id: string;
  tipo_ruta: TipoRuta;
  estado_ruta: EstadoRuta;
  camion: Camion;
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
