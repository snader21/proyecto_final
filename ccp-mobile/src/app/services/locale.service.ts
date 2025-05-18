import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private currentLanguageSubject = new BehaviorSubject<string>('es');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translate: TranslateService) {
    const browserLang = translate.getBrowserLang();
    const savedLang = localStorage.getItem('app_language');

    // Inicializa idioma guardado o del navegador
    const defaultLang = savedLang || (browserLang === 'en' ? 'en' : 'es');
    this.setLanguage(defaultLang);
  }

  get currentLanguage() {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('app_language', lang);
  }

  toggleLanguage() {
    const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }
}
