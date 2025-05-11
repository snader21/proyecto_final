import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalStateSubject = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalStateSubject.asObservable();

  private bulkModalStateSubject = new BehaviorSubject<boolean>(false);
  bulkModalState$ = this.bulkModalStateSubject.asObservable();

  private editProductSubject = new BehaviorSubject<Product | null>(null);
  editProduct$ = this.editProductSubject.asObservable();

  private modalDataSubject = new BehaviorSubject<any | null>(null);
  modalData$ = this.modalDataSubject.asObservable();

  constructor() { }

  openModal(product?: Product) {
    if (product) {
      this.editProductSubject.next(product);
    } else {
      this.editProductSubject.next(null);
    }
    this.modalStateSubject.next(true);
  }

  openModalUser(data?: any) {
    this.modalDataSubject.next(data);
  }

  closeModal() {
    this.modalStateSubject.next(false);
    this.editProductSubject.next(null);
  }

  openBulkModal() {
    this.bulkModalStateSubject.next(true);
  }

  closeBulkModal() {
    this.bulkModalStateSubject.next(false);
  }
}
