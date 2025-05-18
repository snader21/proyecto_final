import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}`;
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) {
    // Verificar si hay sesión activa al iniciar
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
  }

  login(credentials: { correo: string, contrasena: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isAuthenticatedSubject.next(false);
  }

  getLoggedInUser(): any {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }
}
