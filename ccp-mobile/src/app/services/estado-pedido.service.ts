import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoPedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos/estado-pedido`;

  constructor(private http: HttpClient) { }

  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
