import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GlobalConfirmComponent } from './components/global-confirm/global-confirm.component';
import { AuthService } from './services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, GlobalConfirmComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
    });
  }

  logout() {
    this.authService.logout();
  }
}

