import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Ruta } from 'src/app/interfaces/ruta.interface';
import { RutasService } from 'src/app/services/rutas.service';

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
    RutasService
  ]
})
export class RutasPage implements OnInit {
  rutas: Ruta[] = [];
  filteredRutas: Ruta[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private rutasService: RutasService
  ) {}

  ngOnInit() {
    this.loadRutas();
  }

  async loadRutas() {
    this.loading = true;

    try {
      this.rutas = await this.rutasService.getRutas('entrega de pedidos');
      this.filteredRutas = [...this.rutas];
      console.log('Rutas cargadas:', this.rutas);
    } catch (error) {
      console.error('Error loading rutas:', error);
    } finally {
      this.loading = false;
    }
  }

  // Removed loadClientesYBodegas method as it's not needed anymore

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
        nodo.direccion.toLowerCase().includes(searchTerm)
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
