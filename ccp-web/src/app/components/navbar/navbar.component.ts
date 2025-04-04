import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../interfaces/permiso.interface';

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
      if (authStatus) {
        this.initializeMenuItems();
      }
    });
  }

  private initializeMenuItems() {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return;

    const usuario: Usuario = JSON.parse(usuarioStr);
    const rutasPermitidas = usuario.permisos.map(permiso => permiso.ruta);

    const menuItems: MenuItem[] = [];

    // Usuarios
    if (rutasPermitidas.includes('/usuarios')) {
      menuItems.push({
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/usuarios'
      });
    }

    // Fabricantes y Productos
    const fabricantesProductosItems: MenuItem[] = [];
    if (rutasPermitidas.includes('/fabricantes')) {
      fabricantesProductosItems.push({
        label: 'Fabricantes',
        routerLink: '/fabricantes'
      });
    }
    if (rutasPermitidas.includes('/productos')) {
      fabricantesProductosItems.push({
        label: 'Productos',
        routerLink: '/productos'
      });
    }
    if (fabricantesProductosItems.length > 0) {
      menuItems.push({
        label: 'Fabricantes y Productos',
        icon: 'pi pi-shopping-bag',
        items: fabricantesProductosItems
      });
    }

    // Vendedores
    const vendedoresItems: MenuItem[] = [];
    if (rutasPermitidas.includes('/vendedores')) {
      vendedoresItems.push({
        label: 'Vendedores',
        routerLink: '/vendedores'
      });
    }
    if (rutasPermitidas.includes('/reportes')) {
      vendedoresItems.push({
        label: 'Reportes',
        routerLink: '/reportes'
      });
    }
    if (vendedoresItems.length > 0) {
      menuItems.push({
        label: 'Vendedores',
        icon: 'pi pi-id-card',
        items: vendedoresItems
      });
    }

    // Pedidos
    if (rutasPermitidas.includes('/pedidos')) {
      menuItems.push({
        label: 'Pedidos',
        icon: 'pi pi-shopping-cart',
        routerLink: '/pedidos'
      });
    }

    // Logística
    if (rutasPermitidas.includes('/rutas')) {
      menuItems.push({
        label: 'Logística',
        icon: 'pi pi-map-marker',
        routerLink: '/rutas'
      });
    }

    // Agregar controles de idioma y logout (siempre visibles)
    menuItems.push({
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
    });

    menuItems.push({
      label: 'Salir',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    });

    this.items = menuItems;
  }

  onLanguageChange(event: any) {
    if (this.items) {
      const languageItem = this.items.find(item => item.icon === 'pi pi-globe');
      if (languageItem) {
        languageItem.label = event.value.label;
      }
    }
    console.log('Language changed to:', event.value);
  }

  logout() {
    this.authService.logout();
  }
}
