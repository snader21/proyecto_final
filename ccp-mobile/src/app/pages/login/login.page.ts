import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  correo: string = '';
  contrasena: string = '';
  private currentToast: HTMLIonToastElement | null = null;

  constructor(private readonly router: Router, private readonly toastController: ToastController, private readonly authService: AuthService) { }

  ngOnInit() {}

  async login() {
    if (this.correo && this.contrasena) {
      try {
        const response = await firstValueFrom(this.authService.login({ correo: this.correo, contrasena: this.contrasena }));
        this.correo = '';
        this.contrasena = '';
        this.router.navigate(['/home']);
      } catch (error) {
        console.log(error);
        this.showToast('Correo o contraseña incorrectos', 'danger');
      }
    } else {
      this.showToast('No se han ingresado los datos', 'danger');
    }
  }

  async showToast(message: string, color: string) {
    if (this.currentToast) {
      return;
    }

    this.currentToast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color,
      icon: 'alert-circle-outline',
    });

    this.currentToast.onDidDismiss().then(() => {
      this.currentToast = null;
    });

    await this.currentToast.present();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
