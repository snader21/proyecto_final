import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RutaDetailPageRoutingModule } from './ruta-detail-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaDetailPageRoutingModule,
    TranslateModule
  ],
})
export class RutaDetailPageModule {}
