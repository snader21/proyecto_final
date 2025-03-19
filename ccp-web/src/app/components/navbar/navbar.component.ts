import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    NgIf,
    RouterLink
  ]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
    });
  }

  logout() {
    this.authService.logout();
  }
}
