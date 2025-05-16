import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface';

export interface VendedorUserResponse {
  id: string;
  usuario_id: Date;
  nombre: string;
  correo?: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  obtenerVendedorByUsuario(idUsuario: string | null): Observable<VendedorUserResponse> {
      return this.http.get<VendedorUserResponse>(`${this.apiUrl}/vendedores/usuario/${idUsuario}`);
  }
}