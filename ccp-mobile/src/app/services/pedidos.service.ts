import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMetodosEnvio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/metodos-envio`);
  }

  createPedido(pedido: any) {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  getAllPedidos(params?: { numeroPedido?: string; estado?: number; fechaInicio?: string; fechaFin?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/pedidos`;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.numeroPedido?.trim()) queryParams.append('numeroPedido', params.numeroPedido.trim());
      if (params.estado && params.estado !== -1) queryParams.append('estado', params.estado.toString());
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return this.http.get<any[]>(url);
  }

  getPedidosVendedor(idVendedor: string, params?: { numeroPedido?: string; estado?: number; fechaInicio?: string; fechaFin?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/pedidos/vendedor/${idVendedor}`;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.numeroPedido?.trim()) queryParams.append('numeroPedido', params.numeroPedido.trim());
      if (params.estado && params.estado !== -1) queryParams.append('estado', params.estado.toString());
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return this.http.get<any[]>(url);
  }

  getPedidosCliente(idCliente: string, params?: { numeroPedido?: string; estado?: number; fechaInicio?: string; fechaFin?: string }): Observable<any[]> {
    let url = `${this.apiUrl}/pedidos/cliente/${idCliente}`;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.numeroPedido?.trim()) queryParams.append('numeroPedido', params.numeroPedido.trim());
      if (params.estado && params.estado !== -1) queryParams.append('estado', params.estado.toString());
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return this.http.get<any[]>(url);
  }
}
