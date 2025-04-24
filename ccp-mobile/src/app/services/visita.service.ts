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

  constructor(private http: HttpClient) {}

  crearVisita(visita: CreateVisitaDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/visitas`, visita);
  }

  obtenerVisitasCliente(idCliente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/visitas/cliente/${idCliente}`);
  }
}
