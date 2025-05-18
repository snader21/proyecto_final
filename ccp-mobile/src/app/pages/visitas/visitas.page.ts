import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RutasService } from '../../services/rutas.service';
import { Ruta } from '../../interfaces/ruta.interface';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.page.html',
  styleUrls: ['./visitas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [RutasService]
})
export class VisitasPage implements OnInit {
  loading = false;
  searchTerm = '';
  rutas: Ruta[] = [];
  filteredRutas: Ruta[] = [];

  constructor(private rutasService: RutasService) {}

  ngOnInit() {
    this.loadVisitas();
  }

  async loadVisitas() {
    this.loading = true;
    try {
      this.rutas = await this.rutasService.getRutas('visita');
      this.filteredRutas = [...this.rutas];
      console.log('Visitas cargadas:', this.rutas);
    } catch (error) {
      console.error('Error loading visitas:', error);
    } finally {
      this.loading = false;
    }
  }

  async doRefresh(event: any) {
    try {
      await this.loadVisitas();
    } finally {
      event.target.complete();
    }
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
      case 'programada':
        return 'warning';
      case 'en_progreso':
        return 'primary';
      case 'completada':
        return 'success';
      default:
        return 'medium';
    }
  }
}
