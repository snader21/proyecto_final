import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VisitasPageRoutingModule } from './visitas-routing.module';
import { VisitasPage } from './visitas.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitasPageRoutingModule,
    TranslateModule,
    VisitasPage
  ]
})
export class VisitasPageModule {}
