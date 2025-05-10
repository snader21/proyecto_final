import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Usuario } from '../../interfaces/permiso.interface';
import { NgClass } from '@angular/common';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  rutasPermitidas: string[] = [];

  constructor(private readonly router: Router, private readonly localeService: LocaleService) {}

  ngOnInit() {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario: Usuario = JSON.parse(usuarioStr);
      this.rutasPermitidas = usuario.permisos.map(permiso => permiso.ruta);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([`${path}`]);
  }

  tieneAcceso(path: string): boolean {
    return this.rutasPermitidas.includes(path);
  }

  // Método para verificar si el div debe estar "apagado"
  divApagado(rutas: string[]): boolean {
    return !rutas.some(ruta => this.tieneAcceso(ruta));
  }
}
