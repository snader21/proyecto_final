import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { SafeArea } from 'capacitor-plugin-safe-area';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent  implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Rutas', url: '/rutas', icon: 'map' },
    { title: 'Pedidos', url: '/pedidos', icon: 'cart' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly alertController: AlertController) { }

  ngOnInit() {}

  logout() {
    this.alertController.create({
      header: 'Salir',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', role: 'confirm', handler: () => {
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
