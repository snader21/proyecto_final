import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RutasService, Ruta } from '../../services/rutas.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule, RouterModule]
})
export class RutasPage implements OnInit {
  rutas: Ruta[] = [];
  loading = true;
  currentDate = new Date();
  searchTerm = '';

  constructor(
    private loadingCtrl: LoadingController,
    private rutasService: RutasService
  ) {}

  ngOnInit() {
    this.loadRutas();
  }

  async loadRutas() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando rutas...',
    });
    await loading.present();

    try {
      this.rutas = await this.rutasService.getRutas();
      console.log('Rutas cargadas:', this.rutas);
    } catch (error) {
      console.error('Error loading rutas:', error);
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  async doRefresh(event: any) {
    try {
      await this.loadRutas();
    } finally {
      event.target.complete();
    }
  }

  getBadgeColor(estado: Ruta['estado']): string {
    switch (estado) {
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
