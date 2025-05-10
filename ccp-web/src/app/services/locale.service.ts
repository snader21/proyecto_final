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
    console.log('Cambiando idioma...');

    // Detectar y limpiar el idioma del baseHref si está presente
    const rawBaseHref = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';
    console.log("Raw baseHref:", rawBaseHref);

    // Elimina cualquier /en/ o /es/ del baseHref
    const cleanedBaseHref = rawBaseHref.replace(/\/(en|es)\/?$/, '').replace(/\/$/, '');
    console.log("Cleaned baseHref:", cleanedBaseHref);

    // Obtener la ruta actual sin el idioma al principio
    const currentPath = this.location.path();
    console.log("Current path:", currentPath);

    // Limpiar idioma inicial en el path, si existe
    const cleanPath = currentPath.replace(/^\/(en|es)/, '');
    console.log("Clean path:", cleanPath);

    // Construir la nueva ruta con hash
    const newLocalePath = `/${locale}/#${cleanPath}`;
    console.log("New locale path:", newLocalePath);

    // Guardar en localStorage
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);

    // Redirigir
    const newUrl = `${cleanedBaseHref}${newLocalePath}`;
    console.log("Redirecting to:", newUrl);
    window.location.href = newUrl;
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
