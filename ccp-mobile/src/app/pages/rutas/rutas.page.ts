import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Ruta } from 'src/app/interfaces/ruta.interface';
import { RutasService } from 'src/app/services/rutas.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { BodegasService } from 'src/app/services/bodegas.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    RutasService,
    ClientesService,
    BodegasService
  ]
})
export class RutasPage implements OnInit {
  rutas: Ruta[] = [];
  filteredRutas: Ruta[] = [];
  loading = false;
  searchTerm = '';
  clienteMap: Record<string, { nombre: string }> = {};
  bodegaMap: Record<string, { nombre: string }> = {};

  constructor(
    private rutasService: RutasService,
    private clientesService: ClientesService,
    private bodegasService: BodegasService
  ) {}

  ngOnInit() {
    this.loadRutas();
  }

  async loadRutas() {
    this.loading = true;

    try {
      this.rutas = await this.rutasService.getRutas('entrega de pedidos');
      this.filteredRutas = [...this.rutas];
      await this.loadClientesYBodegas();
      console.log('Rutas cargadas:', this.rutas);
    } catch (error) {
      console.error('Error loading rutas:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadClientesYBodegas() {
    for (const ruta of this.rutas) {
      for (const nodo of ruta.nodos_rutas) {
        if (nodo.id_cliente) {
          try {
            const cliente = await this.clientesService.getCliente(nodo.id_cliente);
            if (cliente) {
              this.clienteMap[nodo.id_cliente] = { nombre: cliente.nombre };
            }
          } catch (error) {
            console.error('Error loading cliente:', error);
          }
        }
        if (nodo.id_bodega) {
          try {
            const bodega = await this.bodegasService.getBodega(nodo.id_bodega);
            if (bodega) {
              this.bodegaMap[nodo.id_bodega] = { nombre: bodega.nombre };
            }
          } catch (error) {
            console.error('Error loading bodega:', error);
          }
        }
      }
    }
  }

  async doRefresh(event: any) {
    try {
      await this.loadRutas();
    } finally {
      event.target.complete();
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearHora(hora: string): string {
    return new Date(hora).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    if (!searchTerm) {
      this.filteredRutas = [...this.rutas];
      return;
    }

    this.filteredRutas = this.rutas.filter(ruta => 
      ruta.nodos_rutas.some(nodo => 
        nodo.direccion.toLowerCase().includes(searchTerm) ||
        (nodo.id_cliente && this.clienteMap[nodo.id_cliente]?.nombre.toLowerCase().includes(searchTerm)) ||
        (nodo.id_bodega && this.bodegaMap[nodo.id_bodega]?.nombre.toLowerCase().includes(searchTerm))
      )
    );
  }

  getBadgeColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'PENDIENTE':
        return 'warning';
      case 'EN_PROGRESO':
        return 'primary';
      case 'COMPLETADA':
        return 'success';
      default:
        return 'medium';
    }
  }
}
