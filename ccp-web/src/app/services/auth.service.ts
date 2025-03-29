import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../handlers/error.handler';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService,
    private readonly router: Router
  ) {
    // Opcional: Verificar en localStorage si hay sesión activa
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, password })
        .pipe(
          tap(response => {
            if (response && response.token) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
              this.isAuthenticatedSubject.next(true);
            }
          }),
          catchError(error => this.errorHandler.handleError(error))
        )
    );
    return response;
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('user'); // Elimina el usuario
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
