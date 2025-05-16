import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RutasService, Ruta, Parada } from '../../../services/rutas.service';
import { BodegasService, Bodega } from '../../../services/bodegas.service';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-ruta-detail',
  templateUrl: './ruta-detail.page.html',
  styleUrls: ['./ruta-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, HttpClientModule, RouterModule]
})
export class RutaDetailPage implements OnInit {
  routeTitle = 'Detalles de la Ruta';
  ruta?: Ruta;
  loading = true;
  activeStep = 0;
  bodegaMap: { [key: string]: Bodega } = {};
  clienteMap: { [key: string]: { nombre: string } } = {};

  get currentParada(): Parada | undefined {
    return this.ruta?.paradas[this.activeStep];
  }

  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private rutasService: RutasService,
    private bodegasService: BodegasService,
    private clientesService: ClientesService
  ) {}

  async ngOnInit() {
    const rutaId = this.route.snapshot.paramMap.get('id');
    if (rutaId) {
      await this.loadRutaDetails(rutaId);
    }
  }

  async loadRutaDetails(rutaId: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando detalles de la ruta...',
    });
    await loading.present();

    try {
      const [ruta, bodegaMap, clienteMap] = await Promise.all([
        this.rutasService.getRutaDetails(rutaId),
        this.bodegasService.getBodegasMap(),
        this.clientesService.getClientesMap()
      ]);

      this.ruta = ruta;
      this.bodegaMap = bodegaMap;
      this.clienteMap = clienteMap;

      console.log('Datos cargados:', {
        ruta: this.ruta,
        bodegaMap: this.bodegaMap,
        clienteMap: this.clienteMap
      });
    } catch (error) {
      console.error('Error loading ruta details:', error);
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  segmentChanged(event: any) {
    this.activeStep = parseInt(event.detail.value, 10);
  }

  previousStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  nextStep() {
    if (this.ruta && this.activeStep < this.ruta.paradas.length - 1) {
      this.activeStep++;
    }
  }
}
