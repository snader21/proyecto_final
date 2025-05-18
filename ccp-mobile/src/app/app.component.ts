import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SafeArea } from 'capacitor-plugin-safe-area';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private readonly translate: TranslateService) {
    // Idioma por defecto
    this.translate.setDefaultLang('es');
    // Detectar idioma del navegador
    const browserLang = translate.getBrowserLang();
    // Usar idioma si está soportado, o usar español por defecto
    this.translate.use(browserLang?.match(/en|es/) ? browserLang : 'es');
  }
}

SafeArea.getSafeAreaInsets().then((data) => {
  const { insets } = data;
  document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
  document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`);
  document.body.style.setProperty(
    '--ion-safe-area-bottom',
    `${insets.bottom}px`
  );
  document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
});
