import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Trimestre {
  idQ: string;
  ano: number;
  fechaInicio: string;
  fechaFin: string;
  meta?: number;
  cumplimiento?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanesVentaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTrimestres(ano: number): Observable<Trimestre[]> {
    return this.http.get<Trimestre[]>(`${this.apiUrl}/vendedores/trimestres/${ano}`)
      .pipe(
        map(trimestres => trimestres.map(t => ({
          ...t,
          meta: 15000000, // Valor por defecto
          cumplimiento: 10
        }))),
        catchError(error => {
          console.error('Error al cargar trimestres:', error);
          // Datos de ejemplo en caso de error
          return of([
            { idQ: 'Q1', ano, fechaInicio: `${ano-1}-12-31`, fechaFin: `${ano}-03-30`, meta: 15000000, cumplimiento: 0 },
            { idQ: 'Q2', ano, fechaInicio: `${ano}-03-31`, fechaFin: `${ano}-06-29`, meta: 15000000, cumplimiento: 0 },
            { idQ: 'Q3', ano, fechaInicio: `${ano}-06-30`, fechaFin: `${ano}-09-29`, meta: 15000000, cumplimiento: 10 },
            { idQ: 'Q4', ano, fechaInicio: `${ano}-09-30`, fechaFin: `${ano}-12-30`, meta: 15000000, cumplimiento: 0 }
          ]);
        })
      );
  }
}
