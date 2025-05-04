import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { EventsService } from '../../services/events/events.service';
import { Usuario } from '../../interfaces/user.interfaces';

import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { GestionarUsuariosComponent } from './gestionar-usuarios/gestionar-usuarios.component';
import { ModalService } from '../../services/productos/modal.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, TableModule, ButtonModule, BadgeModule, TagModule, GestionarUsuariosComponent, TooltipModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})

export class UsuariosComponent implements OnInit {


  usuarios: Usuario[] = [];
  loading = false;

  constructor(
    private usuariosService: UsuariosService,
    private eventsService: EventsService,
    private modalService: ModalService
  ) {
    this.eventsService.refreshUsers$.subscribe(() => {
      this.loadUsers();
    });
  }

 ngOnInit() {
    this.loadUsers();
  }

  private loadUsers = () => {
    this.loading = true;
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        console.log('Usuarios recibidos:', usuarios);
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  openModal() {
    this.modalService.openModal();
  }

  editarUsuario(usuario: Usuario) {
    this.modalService.openModal(usuario);
  }

}
