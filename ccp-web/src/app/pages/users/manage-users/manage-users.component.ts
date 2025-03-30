import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ModalService } from '../../../services/modal/modal.service';
import { PrimeNG } from 'primeng/config';
import { EventsService } from '../../../services/events/events.service';
import { UsersService } from '../../../services/users/users.service';
import { Role, Status } from '../../../interfaces/user.interfaces';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    FileUploadModule,
    ToastModule,
    ProgressBarModule,
    BadgeModule,
    HttpClientModule],
  providers: [MessageService],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})

export class ManageUsersComponent implements OnInit {
  visible = false;
  userForm!: FormGroup;
  selectedRole: Role | null = null;
  selectedStatus: Status | null = null;

  role: Role[] = [
    { id_role: 'ADMIN', name: 'Administrador'},
    { id_role: 'SELLER', name: 'Vendedor'}
  ];

  statuses: Status[] = [
    { code: 'ACTIVO', name: 'Activo' },
    { code: 'INACTIVO', name: 'Inactivo' }
  ];

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private config: PrimeNG,
    private fb: FormBuilder,
    private usersService: UsersService,
    private eventsService: EventsService
  ) {
    this.modalService.modalState$.subscribe(state => {
      console.log('state', state);
      this.visible = state;
    });
  }



  ngOnInit() {
    this.initForm();
    this.userForm.get('role')?.valueChanges.subscribe(value => {
      this.selectedRole = value;
    });
    this.userForm.get('status')?.valueChanges.subscribe(value => {
      this.selectedStatus = value;
    });
  }

  private initForm() {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        mail: ['', Validators.required],
        password: [null, Validators.required],
        repassword: [null, Validators.required],
        role: [null, Validators.required],
        status: ['', Validators.required]
      },
      { validators: this.validatorPassword }
    );
  }


  closeModal = () => {
    this.modalService.closeModal();
    this.resetForm();
  }

  resetForm = () => this.userForm.reset();

  onSubmit = () => {
    if (this.userForm.valid) {
      this.saveUser();
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  private saveUser = () => {
    const user = this.userForm.value;
    const userToSave = {
      name: user.name,
      mail: user.mail,
      password: user.password,
      role: { id_role: this.selectedRole?.id_role || '' },
      status: { code: this.selectedStatus?.code || '' }
    };
    console.log('user to save:', userToSave);
    this.usersService.saveUser(userToSave).subscribe(
      savedUser => {
        this.messageService.add({
          key: 'success',
          severity: 'success',
          summary: 'Éxito',
          detail: 'El usuario se ha guardado correctamente',
          life: 3000
        });
        this.eventsService.refreshUsers();
        this.closeModal();
      },
      (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el usuario',
          life: 3000
        });
      }
    );
  }

  private validatorPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const repassword = control.get('repassword')?.value;
    return password === repassword ? null : { passwordMismatch: true };
  };
}
