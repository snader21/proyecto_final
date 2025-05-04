import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesVisitaPageRoutingModule } from './clientes-visita-routing.module';

import { ClientesVisitaPage } from './clientes-visita.page';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoRecorderComponent } from '../../components/video-recorder/video-recorder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesVisitaPageRoutingModule,
    ReactiveFormsModule,
    VideoRecorderComponent
  ],
  declarations: [ClientesVisitaPage]
})
export class ClientesVisitaPageModule {}
