import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    // Opcional: Verificar en localStorage si hay sesión activa
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
  }

  login(token: string) {
    localStorage.setItem('token', token); // Guarda el token (ajústalo según tu backend)
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
