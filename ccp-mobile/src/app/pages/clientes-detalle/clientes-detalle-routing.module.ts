import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesDetallePage } from './clientes-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesDetallePageRoutingModule {}
