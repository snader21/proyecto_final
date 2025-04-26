import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Usuario } from '../../interfaces/permiso.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit, OnDestroy {
  public appPages: { title: string; url: string; icon: string }[] = [];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  private authSubscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly alertController: AlertController
  ) { }

  ngOnInit() {
    this.initializeMenuItems();

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
    console.log("🚀 ~ SidebarComponent ~ initializeMenuItems ~ rutasPermitidas:", rutasPermitidas)
    const menuItems: { title: string; url: string; icon: string }[] = [];

    // Home siempre está disponible
    menuItems.push({ title: 'Home', url: '/home', icon: 'home' });

    // Clientes
    if (rutasPermitidas.includes('/clientes')) {
      menuItems.push({ title: 'Clientes', url: '/clientes', icon: 'people' });
    }

    // Rutas
    if (rutasPermitidas.includes('/rutas')) {
      menuItems.push({ title: 'Rutas', url: '/rutas', icon: 'map' });
    }

    // Pedidos
    if (rutasPermitidas.includes('/pedidos')) {
      menuItems.push({ title: 'Pedidos', url: '/pedidos', icon: 'cart' });
    }

    this.appPages = menuItems;
  }

  logout() {
    this.alertController.create({
      header: 'Salir',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir', role: 'confirm', handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    }).then(alert => alert.present());
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
