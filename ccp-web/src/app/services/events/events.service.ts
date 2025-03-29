import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private refreshProductsSubject = new Subject<void>();
  refreshProducts$ = this.refreshProductsSubject.asObservable();

  refreshProducts() {
    this.refreshProductsSubject.next();
  }
}
