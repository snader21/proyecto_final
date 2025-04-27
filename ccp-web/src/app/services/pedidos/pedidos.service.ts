import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findByIdVendedor(idVendedor: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/${idVendedor}`);
  }
}
