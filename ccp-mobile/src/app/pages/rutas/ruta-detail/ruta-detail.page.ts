import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RutasService } from '../../../services/rutas.service';
import { Ruta, NodoRuta } from '../../../interfaces/ruta.interface';
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
  currentNodo?: NodoRuta;
  loading = true;
  bodegaMap: Record<string, Bodega> = {};
  clienteMap: Record<string, { nombre: string }> = {};

  constructor(
    private route: ActivatedRoute,
    private rutasService: RutasService,
    private bodegasService: BodegasService,
    private clientesService: ClientesService,
  ) {}

  async ngOnInit() {
    const rutaId = this.route.snapshot.paramMap.get('id');
    if (rutaId) {
      await this.loadRuta(rutaId);
    }
  }

  async loadRuta(id: string) {
    const ruta = await this.rutasService.getRutaDetails(id);
    if (ruta) {
      this.ruta = ruta;
      if (this.ruta.nodos_rutas.length) {
        this.currentNodo = this.ruta.nodos_rutas[0];
        await this.loadBodegaDetails();
        await this.loadClienteDetails();
      }
    }
  }

  async loadBodegaDetails() {
    if (this.currentNodo && this.currentNodo.id_bodega) {
      const bodega = await this.bodegasService.getBodega(this.currentNodo.id_bodega);
      if (bodega) {
        this.bodegaMap[this.currentNodo.id_bodega] = bodega;
      }
    }
  }

  async loadClienteDetails() {
    if (this.currentNodo && this.currentNodo.id_cliente) {
      const cliente = await this.clientesService.getCliente(this.currentNodo.id_cliente);
      if (cliente) {
        this.clienteMap[this.currentNodo.id_cliente] = cliente;
      }
    }
  }

  onParadaChange(event: any) {
    const index = parseInt(event.detail.value, 10);
    if (this.ruta?.nodos_rutas[index]) {
      this.currentNodo = this.ruta.nodos_rutas[index];
      this.loadBodegaDetails();
      this.loadClienteDetails();
    }
  }
}
