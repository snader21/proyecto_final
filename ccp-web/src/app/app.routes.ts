import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";
import { UsuariosComponent } from "./pages/usuarios/usuarios.component";
import { FabricantesComponent } from "./pages/fabricantes/fabricantes.component";
import { ProductsComponent } from "./pages/products/products.component";
import { VendedoresComponent } from "./pages/vendedores/vendedores.component";
import { RutasComponent } from "./pages/rutas/rutas.component";
import { UbicacionComponent } from "./pages/ubicacion/ubicacion.component";
import { ReportesComponent } from "./pages/reportes/reportes.component";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },

  // Define el resto de tus rutas de aplicación
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "usuarios",
    component: UsuariosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "productos",
    component: ProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "fabricantes",
    component: FabricantesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "vendedores",
    component: VendedoresComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "reportes",
    component: ReportesComponent,
    canActivate: [AuthGuard],
  },
  { path: "rutas", component: RutasComponent, canActivate: [AuthGuard] },
  {
    path: "ubicacion",
    component: UbicacionComponent,
    canActivate: [AuthGuard],
  },

  // Wildcard redirect: redirige cualquier ruta no encontrada dentro del locale actual a dashboard
  { path: "**", redirectTo: "dashboard" },
];
