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

@Component({
  selector: 'app-users',
  imports: [CardModule, DividerModule, TableModule, ButtonModule, ManageUsersComponent],
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

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers = () => {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openModal() {
    this.modalService.openModal();
  }

}
