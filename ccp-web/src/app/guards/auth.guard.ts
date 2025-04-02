import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Usuario } from '../interfaces/permiso.interface';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const isLoginRoute = state.url === '/login';
  const isDashboardRoute = state.url === '/dashboard';

  if (!token) {
    // Si no hay token y no está en la ruta de login, redirigir al login
    if (!isLoginRoute) {
      router.navigate(['/login']);
      return false;
    }
    // Si no hay token y está en la ruta de login, permitir acceso
    return true;
  }

  // Si hay token y está en la ruta de login, redirigir al dashboard
  if (isLoginRoute) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Si está en el dashboard y está autenticado, permitir acceso
  if (isDashboardRoute) {
    return true;
  }

  // Obtener el usuario del localStorage
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) {
    router.navigate(['/dashboard']);
    return false;
  }

  const usuario: Usuario = JSON.parse(usuarioStr);
  
  // Verificar si el usuario tiene permiso para la ruta actual
  const tienePermiso = usuario.permisos.some(permiso => permiso.ruta === state.url);
  
  if (!tienePermiso) {
    // Si no tiene permiso, redirigir al dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  // Si tiene permiso, permitir acceso
  return true;
};
