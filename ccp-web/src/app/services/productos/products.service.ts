import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

import {
  Category,
  Brand,
  Unit,
  Product,
  CreateProduct,
  MovimientoInventario,
} from "../../interfaces/product.interfaces";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/productos/categorias`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/productos/marcas`);
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/productos/unidades-medida`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/productos`);
  }

  saveProduct(product: CreateProduct, files?: File[]): Observable<Product> {
    const formData = new FormData();
    formData.append("product", JSON.stringify(product));

    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });
    }

    return this.http.post<Product>(`${this.apiUrl}/productos`, formData);
  }

  uploadCSV(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${this.apiUrl}/productos/upload-csv`,
      formData
    );
  }

  getCSVFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/archivos-csv`);
  }

  getUbicaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/ubicaciones`);
  }

  generarEntrada(movimiento: MovimientoInventario) {
    return this.http.post<any>(
      `${this.apiUrl}/productos/movimientos-inventario`,
      movimiento
    );
  }
}
