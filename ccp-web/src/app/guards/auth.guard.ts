import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Usuario } from '../interfaces/permiso.interface';
import { LocaleService } from '../services/locale.service'; // Inyectar el servicio

type AuthGuardFn = (route: any, state: any, router?: Router) => boolean;

export const AuthGuard: AuthGuardFn = (route, state, router = inject(Router)) => {
  const token = localStorage.getItem('token');
  const lang = inject(LocaleService).getCurrentLocale(); // Obtener el idioma actual desde el servicio

  const isLoginRoute = state.url === `/login`; // Ajustar para incluir el idioma
  const isDashboardRoute = state.url === `/dashboard`; // Igual para dashboard

  if (!token) {
    // Si no hay token y no está en la ruta de login, redirigir al login
    if (!isLoginRoute) {
      router.navigate([`/login`]); // Mantener el idioma
      return false;
    }
    // Si no hay token y está en la ruta de login, permitir acceso
    return true;
  }

  // Si hay token y está en la ruta de login, redirigir al dashboard
  if (isLoginRoute) {
    router.navigate([`/dashboard`]); // Mantener el idioma
    return false;
  }

  // Si está en el dashboard y está autenticado, permitir acceso
  if (isDashboardRoute) {
    return true;
  }

  // Obtener el usuario del localStorage
  const usuarioStr = localStorage.getItem('usuario');
  if (!usuarioStr) {
    router.navigate([`/dashboard`]); // Mantener el idioma
    return false;
  }

  const usuario: Usuario = JSON.parse(usuarioStr);
  
  // Verificar si el usuario tiene permiso para la ruta actual
  console.log('RUTAAAA', state.url);
  
  const tienePermiso = usuario.permisos.some(permiso => `${permiso.ruta}` === state.url);
  
  if (!tienePermiso) {
    // Si no tiene permiso, redirigir al dashboard
    router.navigate([`/dashboard`]); // Mantener el idioma
    return false;
  }

  // Si tiene permiso, permitir acceso
  return true;
};
