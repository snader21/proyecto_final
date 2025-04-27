import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Trimestre {
  idQ: string;
  ano: number;
  nombre: string;
}

export interface MetaTrimestral {
  idMeta?: string;
  idPlan?: string;
  idQ: string;
  ano: number;
  metaVenta: number;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface PlanVentasResponse {
  idPlan: string;
  idVendedor: string;
  ano: number;
  fechaCreacion: string;
  fechaModificacion: string;
  metas: MetaTrimestral[];
}

export interface PlanVentas {
  ano: number;
  idVendedor: number;
  metas: MetaTrimestral[];
}

@Injectable({
  providedIn: 'root'
})
export class PlanesVentaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTrimestresPorAno(ano: number): Observable<Trimestre[]> {
    return this.http.get<Trimestre[]>(`${this.apiUrl}/plan-ventas/trimestres/${ano}`);
  }

  putMetaTrimestral(planVentas: PlanVentas): Observable<PlanVentas> {
    return this.http.put<PlanVentas>(`${this.apiUrl}/plan-ventas`, planVentas);
  }

  getPlanVentas(idVendedor: string, ano: number): Observable<PlanVentasResponse[]> {
    return this.http.get<PlanVentasResponse[]>(`${this.apiUrl}/plan-ventas/${idVendedor}/${ano}`);
  }
}
