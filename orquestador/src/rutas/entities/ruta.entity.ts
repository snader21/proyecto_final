export interface RutaEntity {
  id: string;
  fecha: Date;
  duracion_estimada: number;
  duracion_final?: number;
  distancia_total: number;
  vendedor_id?: string;
  numero_ruta: number;
  tipo_ruta: {
    id: string;
    tipo_ruta: string;
  };
  estado_ruta: {
    id: string;
    estado_ruta: string;
  };
  camion?: {
    id: string;
    placa: string;
  };
  nodos_rutas: {
    id: number;
    numeroNodoProgramado: number;
    latitud: number;
    longitud: number;
    direccion: string;
    hora_llegada?: Date;
    hora_salida?: Date;
    id_bodega?: string;
    id_cliente?: string;
    id_pedido?: string;
    productos?: {
      id: number;
      productoId: string;
      cantidad: number;
    }[];
  }[];
}
