import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente.interface';

export interface ClienteResponse {
  id_cliente: string;
  fecha_Cliente: Date;
  observaciones?: string;
  realizo_pedido: boolean;
  key_object_storage?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  obtenerClientes(idVendedor: string | null): Observable<Cliente[]> {
    if (idVendedor) {
      return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/vendedor?vendedorId=${idVendedor}`);
    } else {
      return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
    }
  }

  registrarCliente(cliente: Object): Observable<Cliente[]> {
    return this.http.post<Cliente[]>(`${this.apiUrl}/clientes`, cliente);
  }

  obtenerTiposDeCliente(): Observable<any[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/tipos-cliente`);
  }

  obtenerClientePorUsuario(usuarioId: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/usuario/${usuarioId}`);
  }
}
