import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaDetailPage } from './ruta-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RutaDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaDetailPageRoutingModule {}
