import { Component, OnInit } from '@angular/core';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { UsersService } from '../../services/users/users.service';
import { ModalService } from '../../services/modal/modal.service';
import { EventsService } from '../../services/events/events.service';
import { User } from '../../interfaces/user.interfaces';
import { catchError, of } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-users',
  imports: [CardModule, DividerModule, TableModule, ButtonModule, ManageUsersComponent, BadgeModule, TagModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(
    private usersService: UsersService,
    private modalService: ModalService,
    private eventsService: EventsService
  ) {
    this.eventsService.refreshUsers$.subscribe(() => {
      this.loadUsers();
    });
  }

  lstUser: User[] = [
    {
      id_user: '101',
      name: 'Juan Pérez',
      mail: 'juan.perez@example.com',
      role: { id_role: 'ADMIN', name: 'Administrador' },
      status: { code: 'ACTIVE', name: 'Activo' }
    },
    {
      id_user: '102',
      name: 'María González',
      mail: 'maria.gonzalez@example.com',
      role: { id_role: 'ADMIN', name: 'Administrador' },
      status: { code: 'INACTIVE', name: 'Inactivo' }
    },
    {
      id_user: '103',
      name: 'Carlos Ramírez',
      mail: 'carlos.ramirez@example.com',
      role: { id_role: 'ADMIN', name: 'Administrador' },
      status: { code: 'ACTIVE', name: 'Activo' }
    },
    {
      id_user: '104',
      name: 'Ana López',
      mail: 'ana.lopez@example.com',
      role: { id_role: 'ADMIN', name: 'Administrador' },
      status: { code: 'ACTIVE', name: 'Activo' }
    }
  ];


  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers = () => {
    this.usersService.getUsers().pipe(
      catchError(() => {
        return of(this.lstUser);
      })
    ).subscribe(users => {
      this.users = users;
    });
  }

  openModal() {
    this.modalService.openModal();
  }

}
