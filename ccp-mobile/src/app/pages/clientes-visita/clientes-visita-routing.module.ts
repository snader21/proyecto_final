import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesVisitaPage } from './clientes-visita.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesVisitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesVisitaPageRoutingModule {}
