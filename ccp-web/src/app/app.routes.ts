import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";
import { LanguagePrefixGuard } from "./guards/language-prefix.guard";
import { UsuariosComponent } from "./pages/usuarios/usuarios.component";
import { FabricantesComponent } from "./pages/fabricantes/fabricantes.component";
import { ProductsComponent } from "./pages/products/products.component";
import { VendedoresComponent } from "./pages/vendedores/vendedores.component";

export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LanguagePrefixGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
      { path: 'productos', component: ProductsComponent, canActivate: [AuthGuard] },
      { path: 'fabricantes', component: FabricantesComponent, canActivate: [AuthGuard] },
      { path: 'vendedores', component: VendedoresComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  // Ruta sin lang (opcionalmente, por compatibilidad)
  {
    path: '',
    redirectTo: 'es',
    pathMatch: 'full'
  }
];