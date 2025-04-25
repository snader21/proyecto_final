import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MetodoPago {
  id_metodo_pago: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class MetodosPagoService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.apiUrl}/metodos-pago`);
  }
}
