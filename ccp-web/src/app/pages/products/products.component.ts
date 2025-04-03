import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalService } from '../../services/products/modal.service';
import { ProductsService } from '../../services/products/products.service';
import { EventsService } from '../../services/events/events.service';
import { Product } from '../../interfaces/product.interfaces';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TagModule } from 'primeng/tag';
import { GestionarInventarioComponent } from './gestionar-inventario/gestionar-inventario.component';
import { CommonModule } from '@angular/common';
import { ManageProductBulkComponent } from './manage-product-bulk/manage-product-bulk.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardModule,
    DividerModule,
    TableModule,
    ButtonModule,
    ManageProductComponent,
    NavbarComponent,
    TagModule,
    GestionarInventarioComponent,
    ManageProductBulkComponent,
    CommonModule],
  providers: [ProductsService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showInventoryDialog = false;
  selectedProduct?: Product;

  constructor(
    private productsService: ProductsService,
    private modalService: ModalService,
    private eventsService: EventsService
  ) {
    this.eventsService.refreshProducts$.subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  openModal() {
    this.modalService.openModal();
  }

  openBulkModal() {
    this.modalService.openBulkModal();
  }

  openInventoryDialog(product: Product) {
    this.selectedProduct = product;
    this.showInventoryDialog = true;
  }

  closeInventoryDialog() {
    this.showInventoryDialog = false;
  }
}
