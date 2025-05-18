import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ruta } from '../interfaces/ruta.interface';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private readonly API_URL = `${environment.apiUrl}/rutas`;

  constructor(private http: HttpClient) {
    console.log('API URL:', this.API_URL);
  }

  async getRutas(tipoRuta?: string): Promise<Ruta[]> {
    try {
      let url = this.API_URL;
      if (tipoRuta) {
        const params = new URLSearchParams();
        params.set('tipoRuta', tipoRuta);
        url = `${url}?${params.toString()}`;
      }
      console.log('Fetching rutas from:', url);
      const response = await firstValueFrom(
        this.http.get<Ruta[]>(url)
      );
      console.log('Rutas response:', response);
      return response || [];
    } catch (error) {
      console.error('Error fetching rutas:', error);
      return [];
    }
  }

  async getRutaDetails(rutaId: string): Promise<Ruta | null> {
    try {
      const url = `${this.API_URL}/${rutaId}`;
      console.log('Fetching ruta details from:', url);
      const ruta = await firstValueFrom(
        this.http.get<Ruta>(url)
      );
      console.log('Ruta details response:', ruta);
      return ruta || null;
    } catch (error) {
      console.error('Error fetching ruta details:', error);
      return null;
    }
  }
}
