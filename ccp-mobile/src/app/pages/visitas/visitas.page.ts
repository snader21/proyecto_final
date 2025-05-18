import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RutasService } from '../../services/rutas.service';

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

  constructor(private rutasService: RutasService) {}

  ngOnInit() {
    this.loadVisitas();
  }

  async loadVisitas() {
    this.loading = true;
    try {
      // Aquí cargaremos las visitas usando el servicio
      console.log('Cargando visitas...');
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
    // Aquí implementaremos la búsqueda
  }
}
