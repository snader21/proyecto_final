import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Parada {
  id: string;
  nombre_cliente?: string;
  id_cliente?: string;
  id_bodega?: string;
  id_pedido?: string;
  direccion?: string;
  hora_llegada?: string;
  estado?: string;
}

export interface Ruta {
  id: string;
  fecha: Date;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  paradas: Parada[];
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = `${environment.apiUrl}/rutas`;

  constructor(private http: HttpClient) {}

  async getRutas(): Promise<Ruta[]> {
    return firstValueFrom(
      this.http.get<Ruta[]>(this.apiUrl)
    );
  }

  async getRuta(rutaId: string): Promise<Ruta> {
    return firstValueFrom(
      this.http.get<Ruta>(`${this.apiUrl}/${rutaId}`)
    );
  }

  async getRutaDetails(rutaId: string): Promise<Ruta> {
    const ruta = await this.getRuta(rutaId);
    return ruta;
  }
}
