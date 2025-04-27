import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cliente {
  id_cliente: string;
  nombre: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  documento_identidad?: string;
  id_tipo_cliente?: string;
  id_vendedor?: string | null;
  lat?: string;
  lng?: string;
  tipoCliente?: {
    id_tipo_cliente: string;
    tipo_cliente: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClientesVendedor(idVendedor: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/vendedor?vendedorId=${idVendedor}`);
  }

  getClientesSinVendedor(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes/vendedor`);
  }

  asignarClienteVendedor(idCliente: string, idVendedor: string): Observable<Cliente> {
    return this.apiCall(idCliente, idVendedor);
  }

  eliminarClienteVendedor(idCliente: string): Observable<Cliente> {
    return this.apiCall(idCliente, null);
  }

  private apiCall(idCliente: string, idVendedor: string | null): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/clientes/${idCliente}/vendedor`,
      { id_vendedor: idVendedor },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
