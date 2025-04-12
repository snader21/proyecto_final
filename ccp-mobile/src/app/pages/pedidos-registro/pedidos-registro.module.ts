import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosRegistroPageRoutingModule } from './pedidos-registro-routing.module';

import { PedidosRegistroPage } from './pedidos-registro.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    PedidosRegistroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PedidosRegistroPage]
})
export class PedidosRegistroPageModule {}
