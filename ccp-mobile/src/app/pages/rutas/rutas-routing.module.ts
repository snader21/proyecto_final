import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutasPage } from './rutas.page';
import { RutaDetailPage } from './ruta-detail/ruta-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RutasPage
  },
  {
    path: ':id',
    component: RutaDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutasPageRoutingModule {}
