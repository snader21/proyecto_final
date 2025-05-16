export interface Ruta {
  id: string;
  fecha: Date;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  paradas: Parada[];
}

export interface Parada {
  id: string;
  nombre_cliente: string;
  direccion: string;
  hora_llegada: Date;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  id_bodega?: string;
  id_cliente?: string;
  id_pedido?: string;
}
