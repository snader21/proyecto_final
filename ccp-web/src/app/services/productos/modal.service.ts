import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  private bulkModalState = new BehaviorSubject<boolean>(false);
  bulkModalState$ = this.bulkModalState.asObservable();

  openModal() {
    this.modalState.next(true);
  }

  openBulkModal() {
    this.bulkModalState.next(true);
  }

  closeModal() {
    this.modalState.next(false);
  }

  closeBulkModal() {
    this.bulkModalState.next(false);
  }
}