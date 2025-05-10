import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    Select,
    FormsModule,
    Button,
    IconField,
    InputIcon
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public languages = [{name: 'Español', value: 'es'}, {name: 'English', value: 'en'}];
  public language;
  
  public loginForm = {
    email: '',
    password: ''
  };

  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly localeService: LocaleService
  ) {
    this.language = this.languages.find(l => l.value === this.localeService.getCurrentLocale()) || this.languages[0];
  }
  async onSubmit() {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.loginForm.email, this.loginForm.password);
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = `Error al intentar iniciar sesión. ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  onLanguageChange() {
    if (this.language) this.localeService.switchLocale(this.language.value);
  }
}
