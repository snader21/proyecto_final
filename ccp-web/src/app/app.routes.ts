import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { ManageUsersComponent } from './pages/users/manage-users/manage-users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
];
