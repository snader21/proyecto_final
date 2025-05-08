import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocaleService } from '../services/locale.service';

const supportedLangs = ['en', 'es'];  // Idiomas soportados

@Injectable({
  providedIn: 'root'
})
export class LanguagePrefixGuard implements CanActivate {
  constructor(private router: Router, private localeService: LocaleService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("🚀 ~ LanguagePrefixGuard ~ canActivate ~ route:", state.url)
    const lang = this.localeService.detectLocaleFromUrl(); // Usar el servicio para detectar el idioma
    console.log("🚀 ~ LanguagePrefixGuard ~ canActivate ~ lang:", lang)

    if (!supportedLangs.includes(lang)) {
      // Si el idioma no es soportado, redirigir al idioma por defecto (es)
      this.router.navigate([`/es${state.url}`]);
      return false;
    }
    
    // Si ya tenemos el idioma correcto en la URL, permitir el acceso
    if (state.url.startsWith(`/${lang}`)) {
      return true;
    }

    // Si no tiene el idioma en la URL, redirigir con el prefijo adecuado
    console.log('STATE', state.url);
    
    const newPath = `/${lang}${state.url}`;
    this.router.navigate([newPath]);
    console.log("🚀 ~ LanguagePrefixGuard ~ canActivate ~ newPath:", newPath)
    return false;
  }
}
