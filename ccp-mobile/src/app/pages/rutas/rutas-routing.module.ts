import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./rutas.page').then(m => m.RutasPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./ruta-detail/ruta-detail.page').then(m => m.RutaDetailPage)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutasPageRoutingModule {}
