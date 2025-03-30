import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateUsuario, Usuario } from '../../interfaces/user.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: CreateUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`).pipe(
      tap(response => console.log('Respuesta del servidor:', response))
    );
  }

}
