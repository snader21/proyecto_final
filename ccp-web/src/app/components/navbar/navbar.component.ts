import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LocaleService } from '../../services/locale.service';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../interfaces/permiso.interface';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
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
  selectedLanguage: any;

  constructor(
    private readonly authService: AuthService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly localeService: LocaleService
  ) {
    const currentLocale = this.localeService.getCurrentLocale();
    this.selectedLanguage = this.languages.find(lang => lang.value === currentLocale) || this.languages[0];
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
      if (authStatus) {
        this.initializeMenuItems();
      }
    });

    // Suscribirse a los cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initializeMenuItems(); // Refrescar el menú cuando la ruta cambia
      }
    });
  }

  private initializeMenuItems() {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return;

    const usuario: Usuario = JSON.parse(usuarioStr);
    const rutasPermitidas = usuario.permisos.map(permiso => permiso.ruta);

    const menuItems: MenuItem[] = [];

    const currentLocale = this.localeService.getCurrentLocale(); // Obtener el idioma actual

    // Verificar si la ruta actual es el dashboard
    const isDashboard = this.location.path() === `/${currentLocale}/dashboard`;

    if (!isDashboard) {
      // Usuarios
      if (rutasPermitidas.includes(`/usuarios`)) {
        menuItems.push({
          label: $localize`:@@navbarUsuarios:Usuarios`,
          icon: 'pi pi-users',
          routerLink: `/${currentLocale}/usuarios`
        });
      }

      // Fabricantes y Productos
      const fabricantesProductosItems: MenuItem[] = [];
      if (rutasPermitidas.includes(`/fabricantes`)) {
        fabricantesProductosItems.push({
          label: $localize`:@@navbarFabricantes:Fabricantes`,
          routerLink: `/${currentLocale}/fabricantes`
        });
      }
      if (rutasPermitidas.includes(`/productos`)) {
        fabricantesProductosItems.push({
          label: $localize`:@@navbarProductos:Productos`,
          routerLink: `/${currentLocale}/productos`
        });
      }
      if (fabricantesProductosItems.length > 0) {
        menuItems.push({
          label: $localize`:@@navbarFabricantesProductos:Fabricantes y Productos`,
          icon: 'pi pi-shopping-bag',
          items: fabricantesProductosItems
        });
      }

      // Vendedores
      const vendedoresItems: MenuItem[] = [];
      if (rutasPermitidas.includes(`/vendedores`)) {
        vendedoresItems.push({
          label: $localize`:@@navbarVendedores:Vendedores`,
          routerLink: `/${currentLocale}/vendedores`
        });
      }
      if (rutasPermitidas.includes(`/reportes`)) {
        vendedoresItems.push({
          label: $localize`:@@navbarReportes:Reportes`,
          routerLink: `/${currentLocale}/reportes`
        });
      }
      if (vendedoresItems.length > 0) {
        menuItems.push({
          label: $localize`:@@navbarVendedoresGrupo:Vendedores`,
          icon: 'pi pi-id-card',
          items: vendedoresItems
        });
      }

      // Pedidos
      if (rutasPermitidas.includes(`/pedidos`)) {
        menuItems.push({
          label: $localize`:@@navbarPedidos:Pedidos`,
          icon: 'pi pi-shopping-cart',
          routerLink: `/${currentLocale}/pedidos`
        });
      }

      // Logística
      if (rutasPermitidas.includes(`/rutas`)) {
        menuItems.push({
          label: $localize`:@@navbarLogistica:Logística`,
          icon: 'pi pi-map-marker',
          routerLink: `/${currentLocale}/rutas`
        });
      }
    }

    // Agregar controles de idioma y logout (siempre visibles)
    menuItems.push({
      label: this.selectedLanguage.label, // Esto ya está dinámico
      icon: 'pi pi-globe',
      items: [
        {
          label: $localize`:@@idiomaEspanol:Español`,
          command: () => this.onLanguageChange({ value: { label: 'Español', value: 'es' } })
        },
        {
          label: $localize`:@@idiomaIngles:English`,
          command: () => this.onLanguageChange({ value: { label: 'English', value: 'en' } })
        }
      ]
    });

    menuItems.push({
      label: $localize`:@@navbarSalir:Salir`,
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
    this.localeService.switchLocale(event.value.value);
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
