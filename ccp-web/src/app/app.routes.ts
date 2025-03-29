import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
];
