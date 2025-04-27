import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  tiposCliente: any[] = [];

  constructor(
    private readonly location: Location,
    private readonly formBuilder: FormBuilder,
    private readonly clienteService: ClienteService,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private readonly router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      documento_identidad: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      id_tipo_cliente: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  async ngOnInit() {
    try {
      this.tiposCliente = await firstValueFrom(this.clienteService.obtenerTiposDeCliente());
    } catch (error) {
      console.error('Error al cargar tipos de cliente:', error);
      this.showToast('Error al cargar tipos de cliente');
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena')?.value;
    const confirmPassword = form.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async register() {
    if (this.registerForm.invalid) {
      this.showToast('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...'
    });
    await loading.present();

    try {
      const userData = {
        nombre: this.registerForm.get('nombre')?.value,
        correo: this.registerForm.get('correo')?.value,
        contrasena: this.registerForm.get('contrasena')?.value,
        documento_identidad: this.registerForm.get('documento_identidad')?.value,
        telefono: this.registerForm.get('telefono')?.value,
        direccion: this.registerForm.get('direccion')?.value,
        id_tipo_cliente: this.registerForm.get('id_tipo_cliente')?.value
      };

      await firstValueFrom(this.clienteService.registrarCliente(userData));
      await this.showToast('Registro exitoso');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error en el registro:', error);
      let mensajeError = 'Error al registrar. Por favor, intenta nuevamente';
      
      if (error.error && error.error.message) {
        mensajeError = error.error.message;
      } else if (error.message) {
        mensajeError = error.message;
      }

      this.showToast(mensajeError);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  goToLogin() {
    this.location.back();
  }
} 