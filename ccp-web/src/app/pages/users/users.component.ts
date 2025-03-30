import { Component } from '@angular/core';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

interface User {
  name: string;
  mail: string;
  role: string;
  state: string;
}

@Component({
  selector: 'app-users',
  imports: [CardModule, DividerModule, TableModule, ButtonModule, ManageUsersComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent {
  users: User[] = [
    {
      name: 'Laptop ThinkPad',
      mail: 'mail@createComponent.com',
      role: 'Administrador',
      state: 'Unidad'
    },
    {
      name: 'Wireless Mouse',
      mail: 'mail@createComponent.com',
      role: 'Administrador',
      state: 'Unidad'
    },
    {
      name: 'USB-C Cable',
      mail: 'mail@createComponent.com',
      role: 'Administrador',
      state: 'Unidad'
    },
    {
      name: 'Monitor 27"',
      mail: 'mail@createComponent.com',
      role: 'Administrador',
      state: 'Unidad'
    }
  ];

  constructor(
    //private modalService: ModalService
  ) {}

  openModal() {
    console.log('openModal');
    //this.modalService.openModal();
  }

}
