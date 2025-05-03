import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CreateUsuario, UpdateUsuario, Usuario } from '../../interfaces/user.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: CreateUsuario): Observable<Usuario> {
    console.log('Enviando usuario al backend:', usuario);
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`).pipe(
      tap(response => console.log('Respuesta del servidor:', response))
    );
  }

  editarUsuario(usuario: UpdateUsuario): Observable<Usuario> {
    console.log('Enviando actualización al backend:', usuario);
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${usuario.id}`, usuario).pipe(
      tap(response => console.log('Respuesta del servidor (edición):', response))
    );
  }

}
