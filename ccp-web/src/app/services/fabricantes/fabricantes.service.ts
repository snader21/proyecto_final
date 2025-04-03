import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface Fabricante {
    readonly id: number;
    readonly nombre: string;
    readonly correo: string;
    readonly direccion: string;
    readonly estado: string;
    readonly telefono: string;
    readonly ciudad_id: string;
    readonly pais_id: string;
}

interface Lugar {
    readonly id: string;
    readonly nombre: string;
}

@Injectable({
    providedIn: 'root',
})
export class FabricantesService {
    private readonly API_URL = `${environment.apiUrl}/fabricantes`;

    constructor(private readonly http: HttpClient) { }

    private fetchData<T>(url: string): Promise<T> {
        return firstValueFrom(this.http.get<T>(url));
    }

    getFabricantes(): Promise<Fabricante[]> {
        return this.fetchData<Fabricante[]>(this.API_URL);
    }

    getFabricante(id: number): Promise<Fabricante> {
        return this.fetchData<Fabricante>(`${this.API_URL}/${id}`);
    }

    createFabricante(fabricante: Fabricante): Promise<Fabricante> {
        return firstValueFrom(this.http.post<Fabricante>(this.API_URL, fabricante));
    }

    updateFabricante(id: number, fabricante: Fabricante): Promise<Fabricante> {
        return firstValueFrom(this.http.put<Fabricante>(`${this.API_URL}/${id}`, fabricante));
    }

    deleteFabricante(id: number): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.API_URL}/${id}`));
    }

    getCiudadesByPais(pais_id: string): Promise<Lugar[]> {
        return this.fetchData<Lugar[]>(`${this.API_URL}/paises/${pais_id}/ciudades`);
    }

    getCiudades(): Promise<Lugar[]> {
        return this.fetchData<Lugar[]>(`${this.API_URL}/ciudades`);
    }

    getPaises(): Promise<Lugar[]> {
        return this.fetchData<Lugar[]>(`${this.API_URL}/paises`);
    }
}
