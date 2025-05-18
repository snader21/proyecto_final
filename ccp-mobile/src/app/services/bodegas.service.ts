import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bodega {
  id_bodega: string;
  nombre: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  capacidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class BodegasService {
  private apiUrl = `${environment.apiUrl}/productos/bodegas`;
  private bodegasMap: { [key: string]: Bodega } = {};

  constructor(private http: HttpClient) {}

  async getBodegas(): Promise<Bodega[]> {
    const bodegas = await firstValueFrom(
      this.http.get<Bodega[]>(this.apiUrl)
    );

    // Actualizar el mapa de bodegas
    this.bodegasMap = {};
    for (const bodega of bodegas) {
      this.bodegasMap[bodega.id_bodega] = bodega;
    }

    return bodegas;
  }

  async getBodegasMap(): Promise<{ [key: string]: Bodega }> {
    if (Object.keys(this.bodegasMap).length === 0) {
      await this.getBodegas();
    }
    return this.bodegasMap;
  }

  async getBodega(id: string): Promise<Bodega> {
    if (!this.bodegasMap[id]) {
      await this.getBodegas();
    }
    return this.bodegasMap[id];
  }
}
