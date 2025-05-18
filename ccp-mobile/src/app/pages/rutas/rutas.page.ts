import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    HttpClientModule,
    TranslateModule
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
    private rutasService: RutasService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadRutas();
  }

  async loadRutas() {
    this.loading = true;

    try {
      this.rutas = await this.rutasService.getRutas('entrega');
      this.filteredRutas = [...this.rutas];
      console.log('Rutas cargadas:', this.rutas);
    } catch (error) {
      console.error(this.translate.instant('ROUTES.MESSAGES.ERROR_LOADING'), error);
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
    return new Date(fecha).toLocaleDateString(this.translate.currentLang === 'es' ? 'es-CO' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearHora(hora: string): string {
    return new Date(hora).toLocaleTimeString(this.translate.currentLang === 'es' ? 'es-CO' : 'en-US', {
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
    const estadoKey = estado.toUpperCase().replace(' ', '_');
    switch (estadoKey) {
      case 'PENDIENTE':
      case 'PENDING':
        return 'warning';
      case 'EN_PROGRESO':
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETADA':
      case 'COMPLETED':
        return 'success';
      default:
        return 'medium';
    }
  }
}
