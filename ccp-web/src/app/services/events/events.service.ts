import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private refreshProductsSubject = new Subject<void>();
  private refreshUsersSubject = new Subject<void>();

  refreshProducts$ = this.refreshProductsSubject.asObservable();
  refreshUsers$ = this.refreshUsersSubject.asObservable();

  refreshProducts = () => this.refreshProductsSubject.next();
  refreshUsers = () => this.refreshUsersSubject.next();
}
