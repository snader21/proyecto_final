import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientesVisitaPageRoutingModule } from './clientes-visita-routing.module';
import { ClientesVisitaPage } from './clientes-visita.page';
import { TranslateModule } from '@ngx-translate/core';
import { VideoRecorderComponent } from '../../components/video-recorder/video-recorder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientesVisitaPageRoutingModule,
    TranslateModule,
    VideoRecorderComponent
  ],
  declarations: [ClientesVisitaPage]
})
export class ClientesVisitaPageModule {}
