export interface Vendedor {
  readonly id: number;
  readonly nombre: string;
  readonly correo: string;
  readonly estado: string;
  readonly usuario_id: string;
  readonly zona: Zona;
}

export interface Zona {
  id: string;
  nombre: string;
  descripcion: string;
}
