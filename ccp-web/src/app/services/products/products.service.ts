import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Category, Brand, Unit, Product, CreateProduct } from '../../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiProductos = environment.apiProductos;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiProductos}/productos/categorias`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiProductos}/productos/marcas`);
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiProductos}/productos/unidades-medida`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiProductos}/productos`);
  }

  saveProduct(product: CreateProduct, files?: File[]): Observable<Product> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));

    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });
    }

    return this.http.post<Product>(`${this.apiProductos}/productos`, formData);
  }
}
