import { Component, OnInit, OnDestroy, SimpleChanges } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ModalService } from "../../services/productos/modal.service";
import { ProductsService } from "../../services/productos/products.service";
import { EventsService } from "../../services/events/events.service";
import { Product } from "../../interfaces/product.interfaces";
import { ManageProductComponent } from "./manage-product/manage-product.component";
import { TagModule } from "primeng/tag";
import { GestionarInventarioComponent } from "./gestionar-inventario/gestionar-inventario.component";
import { CommonModule } from "@angular/common";
import { ManageProductBulkComponent } from "./manage-product-bulk/manage-product-bulk.component";
import { ImageModule } from "primeng/image";
import { InputTextModule } from "primeng/inputtext";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { Subscription } from "rxjs";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    TableModule,
    ButtonModule,
    ManageProductComponent,
    TagModule,
    GestionarInventarioComponent,
    ManageProductBulkComponent,
    CommonModule,
    ImageModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [ProductsService],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  showInventoryDialog = false;
  selectedProduct?: Product;
  private subscriptions = new Subscription();

  constructor(
    private productsService: ProductsService,
    private modalService: ModalService,
    private eventsService: EventsService,
    private messageService: MessageService
  ) {
    this.eventsService.refreshProducts$.subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public loadProducts() {
    const sub = this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar los productos",
        });
      },
    });
    this.subscriptions.add(sub);
  }

  openModal(product?: Product) {
    this.modalService.openModal(product);
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

  onInventoryDialogVisibilityChange(visible: boolean) {
    this.showInventoryDialog = visible;
  }
}
