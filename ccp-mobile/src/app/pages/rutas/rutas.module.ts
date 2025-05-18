import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RutasPageRoutingModule } from './rutas-routing.module';
import { RutasPage } from './rutas.page';
import { RutasService } from '../../services/rutas.service';
import { ClientesService } from '../../services/clientes.service';
import { BodegasService } from '../../services/bodegas.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    RutasPageRoutingModule
  ]
})
export class RutasPageModule {}
