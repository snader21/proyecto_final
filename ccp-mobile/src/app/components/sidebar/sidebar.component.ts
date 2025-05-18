import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Usuario } from '../../interfaces/permiso.interface';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentLang = 'es'; // idioma por defecto
  public appPages: { title: string; url: string; icon: string }[] = [];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  private authSubscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertController: AlertController,
    private readonly translate: TranslateService,
    private readonly localeService: LocaleService,
  ) { 
    this.currentLang = this.localeService.currentLanguage;
  }

  ngOnInit() {
    this.localeService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
      this.initializeMenuItems(); // actualiza menú con textos en el nuevo idioma
    });

    // Suscribirse a los cambios de autenticación
    this.authSubscription = this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.initializeMenuItems();
      }
    });
  }

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruye
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private initializeMenuItems() {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return;

    const usuario: Usuario = JSON.parse(usuarioStr);
    const rutasPermitidas = usuario.permisos.map(permiso => permiso.ruta);

    const menuItems: { title: string; url: string; icon: string }[] = [];

    // Usamos instant() para traducir de forma sincrónica
    menuItems.push({ title: this.translate.instant('MENU.HOME'), url: '/home', icon: 'home' });

    if (rutasPermitidas.includes('/clientes')) {
      menuItems.push({ title: this.translate.instant('MENU.CLIENTS'), url: '/clientes', icon: 'people' });
    }

    if (rutasPermitidas.includes('/rutas')) {
      menuItems.push({ title: this.translate.instant('MENU.ROUTES'), url: '/rutas', icon: 'map' });
    }

    // Visitas
    if (rutasPermitidas.includes('/rutas')) {
      menuItems.push({ title: this.translate.instant('MENU.VISITAS'), url: '/visitas', icon: 'calendar' });
    }

    // Pedidos
    if (rutasPermitidas.includes('/pedidos')) {
      menuItems.push({ title: this.translate.instant('MENU.ORDERS'), url: '/pedidos', icon: 'cart' });
    }

    this.appPages = menuItems;
  }

  logout() {
    this.alertController.create({
      header: this.translate.instant('MENU.LOGOUT_TITLE'),
      message: this.translate.instant('MENU.LOGOUT_MSG'),
      buttons: [
        {
          text: this.translate.instant('MENU.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('MENU.CONFIRM'),
          role: 'confirm',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  toggleLanguage() {
    this.localeService.toggleLanguage();
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
