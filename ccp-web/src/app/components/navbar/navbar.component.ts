import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    MenubarModule,
    AvatarModule,
    InputTextModule,
    BadgeModule,
    DropdownModule,
    FormsModule
  ]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  items: MenuItem[] | undefined;
  languages = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' }
  ];
  selectedLanguage: any = { label: 'Español', value: 'es' };

  constructor(private readonly authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
    });

    this.items = [
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/usuarios'
      },
      {
        label: 'Fabricantes y Productos',
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: 'Fabricantes',
            routerLink: '/fabricantes'
          },
          {
            label: 'Productos',
          }
        ],
      },
      {
        label: 'Vendedores',
        icon: 'pi pi-id-card',
        items: [
          {
            label: 'Vendedores',
          },
          {
            label: 'Reportes',
          }
        ],
      },
      {
        label: 'Pedidos',
        icon: 'pi pi-shopping-cart',
        routerLink: '/pedidos'
      },
      {
        label: 'Logística',
        icon: 'pi pi-map-marker',
        routerLink: '/logistica'
      },
      {
        label: this.selectedLanguage.label,
        icon: 'pi pi-globe',
        items: [
          {
            label: 'Español',
            command: () => this.onLanguageChange({ value: { label: 'Español', value: 'es' } })
          },
          {
            label: 'English',
            command: () => this.onLanguageChange({ value: { label: 'English', value: 'en' } })
          }
        ]
      },
      {
        label: 'Salir',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  onLanguageChange(event: any) {
    // Update the menu item label with the selected language
    if (this.items) {
      const languageItem = this.items.find(item => item.icon === 'pi pi-globe');
      if (languageItem) {
        languageItem.label = event.value.label;
      }
    }
    // Here you can implement the language change logic
    console.log('Language changed to:', event.value);
  }

  logout() {
    this.authService.logout();
  }
}
