import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { ProductsService } from '../../services/productos/products.service';
import { FormsModule } from '@angular/forms';
import { ProductoConUbicacion } from '../../interfaces/product.interfaces';
import { BodegaMapComponent } from '../../components/bodega-map/bodega-map.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';


@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [FormsModule, BodegaMapComponent, CommonModule, InputTextModule, FloatLabelModule, MessageModule],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent implements OnInit {
  searchTerm = '';
  productos: ProductoConUbicacion[] = [];
  loading = false;
  errorMessage = '';
  private searchTerms = new Subject<string>();

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchProductos(term))
    ).subscribe();
  }

  searchProductos(term: string): Observable<ProductoConUbicacion[]> {
    if (term.length < 3) {
      this.productos = [];
      this.errorMessage = '';
      return of([]);
    }

    this.loading = true;
    return this.productsService.searchProductsByLocation(term)
      .pipe(
        tap(response => {
          this.productos = response;
          this.loading = false;
        }),
        catchError(error => {
          this.errorMessage = 'No se encontraron productos';
          this.loading = false;
          return of([]);
        })
      );
  }

  search(term: string) {
    this.searchTerms.next(term);
  }
}