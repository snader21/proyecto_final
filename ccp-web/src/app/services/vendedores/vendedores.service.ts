import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { firstValueFrom } from "rxjs";
import { Vendedor, Zona } from "../../interfaces/vendedor.interface";

interface UpdateUserVendedor {
  nombre: string;
  correo: string;
}

@Injectable({
  providedIn: "root",
})
export class VendedoresService {
  private readonly API_URL = `${environment.apiUrl}/vendedores`;

  constructor(private readonly http: HttpClient) {}

  private fetchData<T>(url: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(url));
  }

  getVendedores(): Promise<Vendedor[]> {
    return this.fetchData<Vendedor[]>(this.API_URL);
  }

  getVendedor(id: number): Promise<Vendedor> {
    return this.fetchData<Vendedor>(`${this.API_URL}/${id}`);
  }

  createVendedor(vendedor: Vendedor): Promise<Vendedor> {
    return firstValueFrom(this.http.post<Vendedor>(this.API_URL, vendedor));
  }

  updateVendedor(id: number, vendedor: Vendedor): Promise<Vendedor> {
    return firstValueFrom(
      this.http.put<Vendedor>(`${this.API_URL}/${id}`, vendedor)
    );
  }

  deleteVendedor(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.API_URL}/${id}`));
  }

  getZonas(): Promise<Zona[]> {
    return this.fetchData<Zona[]>(`${this.API_URL}/zonas`);
  }

  updateUserVendedor(id: string, updateUserVendedorDto: UpdateUserVendedor): Promise<Vendedor> {
    return firstValueFrom(
      this.http.patch<Vendedor>(`${this.API_URL}/${id}/usuario`, updateUserVendedorDto)
    );
  }
}
