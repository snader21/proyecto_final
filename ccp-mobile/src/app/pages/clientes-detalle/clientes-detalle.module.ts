import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesDetallePageRoutingModule } from './clientes-detalle-routing.module';

import { ClientesDetallePage } from './clientes-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesDetallePageRoutingModule
  ],
  declarations: [ClientesDetallePage]
})
export class ClientesDetallePageModule {}
