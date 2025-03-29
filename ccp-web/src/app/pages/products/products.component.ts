import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalService } from '../../services/products/modal.service';
import { ManageProductComponent } from './manage-product/manage-product.component';

interface Product {
  code: string;
  name: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  status: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardModule, DividerModule, TableModule, ButtonModule, ManageProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: Product[] = [
    {
      code: 'P001',
      name: 'Laptop ThinkPad',
      category: 'Electronics',
      quantity: 10,
      measurement: 'Unidad',
      price: 1200,
      status: 'Activo'
    },
    {
      code: 'P002',
      name: 'Wireless Mouse',
      category: 'Accessories',
      quantity: 25,
      measurement: 'Unidad',
      price: 1200,
      status: 'Activo'
    },
    {
      code: 'P003',
      name: 'USB-C Cable',
      category: 'Accessories',
      quantity: 50,
      measurement: 'Unidad',
      price: 1200,
      status: 'Activo'
    },
    {
      code: 'P004',
      name: 'Monitor 27"',
      category: 'Electronics',
      quantity: 8,
      measurement: 'Unidad',
      price: 1200,
      status: 'Activo'
    }
  ];

  constructor(private modalService: ModalService) {}

  openModal() {
    console.log('openModal');
    this.modalService.openModal();
  }
}
