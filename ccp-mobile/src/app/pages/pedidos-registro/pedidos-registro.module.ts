import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PedidosRegistroPageRoutingModule } from './pedidos-registro-routing.module';
import { PedidosRegistroPage } from './pedidos-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PedidosRegistroPageRoutingModule,
    TranslateModule
  ],
  declarations: [PedidosRegistroPage]
})
export class PedidosRegistroPageModule {}
