import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ModalService } from '../../../services/modal/modal.service';
import { PrimeNG } from 'primeng/config';
import { EventsService } from '../../../services/events/events.service';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { RolesService } from '../../../services/roles/roles.service';
import { Rol } from '../../../interfaces/user.interfaces';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-gestionar-usuarios',
  standalone: true,
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
    HttpClientModule,
    InputSwitchModule],
  providers: [MessageService],
  templateUrl: './gestionar-usuarios.component.html',
  styleUrl: './gestionar-usuarios.component.scss'
})

export class GestionarUsuariosComponent implements OnInit {
  visible = false;
  userForm!: FormGroup;
  selectedRoleId: string | null = null;
  selectedStatus: string | null = null;

  roles: Rol[] = [];

  estadosOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' }
  ];

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private config: PrimeNG,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private eventsService: EventsService,
    private rolesService: RolesService
  ) {
    this.modalService.modalState$.subscribe(state => {
      console.log('state', state);
      this.visible = state;
    });
  }

  ngOnInit() {
    this.cargarRoles();
    this.initForm();

    // Suscribirse a los cambios de rol y estado
    this.userForm.get('rol')?.valueChanges.subscribe(value => {
      this.selectedRoleId = value;
    });

    this.userForm.get('estado')?.valueChanges.subscribe(value => {
      this.selectedStatus = value;
    });
  }

  private cargarRoles() {
    this.rolesService.obtenerRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  private initForm() {
    this.userForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        correo: ['', Validators.required],
        contrasena: [null, [Validators.required, Validators.minLength(6)]],
        repassword: [null, Validators.required],
        rol: ['', Validators.required],
        estado: ['active', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
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
    const formData = this.userForm.value;
    const usuario = {
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: formData.contrasena,
      roles: this.selectedRoleId ? [this.selectedRoleId] : [],
      estado: formData.estado
    };
    console.log('usuario a guardar:', usuario);
    this.usuariosService.crearUsuario(usuario).subscribe(
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
        console.error('Error del backend:', error);
        if (Array.isArray(error.error)) {
          // Si es un array de errores de validación, mostrar cada uno
          error.error.forEach((message: string) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error de validación',
              detail: message,
              life: 5000
            });
          });
        } else {
          // Si es un error general
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al guardar el usuario',
            life: 3000
          });
        }
      }
    );
  }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const contrasena = control.get('contrasena')?.value;
    const confirmPassword = control.get('repassword')?.value;
    if (contrasena !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}
