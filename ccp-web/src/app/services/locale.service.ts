import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private currentLocale: string = 'es';  // Por defecto en 'es'

  constructor(private location: Location) {
    // Intentar cargar el idioma desde localStorage (si existe)
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale) {
      this.currentLocale = storedLocale;
    }
  }

  // Obtener el idioma actual
  getCurrentLocale(): string {
    return this.currentLocale;
  }

  // Cambiar el idioma y guardar el valor
  switchLocale(locale: string) {
    const baseHref = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';
    const currentPath = this.location.path();
  
    // Limpiar la ruta del idioma actual y agregar el nuevo idioma
    const cleanPath = currentPath.replace(/^\/(en|es)/, '');
    const newLocalePath = locale === 'en' ? `/en${cleanPath}` : `/es${cleanPath}`;
  
    // Actualizar el idioma en el store
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);

    window.location.href = `${baseHref.replace(/\/$/, '')}${newLocalePath}`;
  }

  // Detectar el idioma en la URL (para el guard)
  detectLocaleFromUrl(): string {
    const path = this.location.path();
    if (path.startsWith('/en')) {
      return 'en';
    } else if (path.startsWith('/es')) {
      return 'es';
    } else {
      return this.currentLocale;  // Si no hay idioma en la URL, devolver el idioma almacenado
    }
  }
}
