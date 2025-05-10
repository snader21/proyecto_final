import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { firstValueFrom } from "rxjs";
import { Ruta } from "../../interfaces/ruta.interface";

@Injectable({
  providedIn: "root",
})
export class RutasService {
  private readonly API_URL = `${environment.apiUrl}/rutas`;

  constructor(private readonly http: HttpClient) {}

  private fetchData<T>(url: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(url));
  }

  getRutas(): Promise<Ruta[]> {
    return this.fetchData<Ruta[]>(this.API_URL);
  }

  getRuta(id: string): Promise<Ruta> {
    return this.fetchData<Ruta>(`${this.API_URL}/${id}`);
  }
}
