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
}
