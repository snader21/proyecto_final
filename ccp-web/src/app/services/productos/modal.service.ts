import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  private modalData = new BehaviorSubject<any>(null);
  modalData$ = this.modalData.asObservable();

  private bulkModalState = new BehaviorSubject<boolean>(false);
  bulkModalState$ = this.bulkModalState.asObservable();

  openModal(data?: any) {
    this.modalData.next(data);
    this.modalState.next(true);
  }

  openBulkModal() {
    this.bulkModalState.next(true);
  }

  closeModal() {
    this.modalState.next(false);
    this.modalData.next(null);
  }

  closeBulkModal() {
    this.bulkModalState.next(false);
  }
}
