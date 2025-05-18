import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cliente {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/clientes`;
  private clientesMap: { [key: string]: Cliente } = {};

  constructor(private http: HttpClient) {}

  async getClientes(): Promise<Cliente[]> {
    const clientes = await firstValueFrom(
      this.http.get<Cliente[]>(this.apiUrl)
    );
    
    // Actualizar el mapa de clientes
    this.clientesMap = {};
    for (const cliente of clientes) {
      this.clientesMap[cliente.id] = cliente;
    }
    
    return clientes;
  }

  async getClientesMap(): Promise<{ [key: string]: Cliente }> {
    if (Object.keys(this.clientesMap).length === 0) {
      await this.getClientes();
    }
    return this.clientesMap;
  }

  async getCliente(id: string): Promise<Cliente> {
    if (!this.clientesMap[id]) {
      await this.getClientes();
    }
    return this.clientesMap[id];
  }
}
