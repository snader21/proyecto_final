import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Trimestre {
  idQ: string;
  ano: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface MetaTrimestral {
  idMeta: number;
  idPlan: number;
  idQ: string;
  ano: number;
  idVendedor: number;
  metaVenta: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanesVentaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTrimestres(ano: number): Observable<Trimestre[]> {
    return this.http.get<Trimestre[]>(`${this.apiUrl}/plan-ventas/trimestres/${ano}`);
  }

  putMetaTrimestral(metaTrimestral: MetaTrimestral): Observable<MetaTrimestral> {
    return this.http.put<MetaTrimestral>(`${this.apiUrl}/plan-ventas/${metaTrimestral.ano}`, metaTrimestral);
  }




}
