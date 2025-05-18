export class NodoVisita {
  numeroNodoProgramado: number;
  latitud: number;
  longitud: number;
  direccion: string | null;
  hora_llegada: string;
  hora_salida: string;
  id_bodega: string | null;
  id_cliente: string;
  id_pedido: string | null;
  productos: null;
}

export class VisitaProgramada {
  duracionEstimada: number;
  fecha: string;
  distanciaTotal: number;
  camionId: string | null;
  nodos: NodoVisita[];
}

export class VendedorVisitas {
  id_vendedor: string;
  visitas_programadas: VisitaProgramada[];
}

export class RutasVisitaVendedores {
  vendedores: VendedorVisitas[];
}
