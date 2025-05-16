import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CreateVisitaDto } from '../interfaces/visita.interface';

export interface VisitaResponse {
  id_cliente: string;
  fecha_visita: Date;
  observaciones?: string;
  realizo_pedido: boolean;
  key_object_storage?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearVisita(visita: CreateVisitaDto, videoFile: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('id_cliente', visita.id_cliente); // string
    formData.append('fecha_visita', visita.fecha_visita.toISOString()); // string ISO
    formData.append('realizo_pedido', visita.realizo_pedido ? 'true' : 'false'); // string "true"/"false"
    if (visita.observaciones) {
      formData.append('observaciones', visita.observaciones);
    }
    if (videoFile) {
      formData.append('video', videoFile); 
    }
    return this.http.post(`${this.apiUrl}/clientes/visitas`, formData);
  }

  obtenerVisitasCliente(idCliente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/visitas/cliente/${idCliente}`);
  }

  obtenerVideo(video_key: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/visitas/video/${video_key}`);
  }
}
