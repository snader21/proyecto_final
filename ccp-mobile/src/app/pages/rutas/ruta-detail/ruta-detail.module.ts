import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaDetailPageRoutingModule } from './ruta-detail-routing.module';

import { RutaDetailPage } from './ruta-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaDetailPageRoutingModule
  ],
  declarations: [RutaDetailPage]
})
export class RutaDetailPageModule {}
