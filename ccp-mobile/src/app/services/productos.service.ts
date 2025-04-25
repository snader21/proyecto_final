import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getInventario(nombre_producto?: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos/inventarios`, {
      params: nombre_producto ? { nombre_producto } : {}
    });
  }
}
