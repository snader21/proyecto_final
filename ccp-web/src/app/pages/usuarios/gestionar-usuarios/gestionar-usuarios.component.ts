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
import { ModalService } from '../../../services/productos/modal.service';
import { PrimeNG } from 'primeng/config';
import { EventsService } from '../../../services/events/events.service';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
import { RolesService } from '../../../services/roles/roles.service';
import { Rol, UpdateUsuario, Usuario, CreateUsuario } from '../../../interfaces/user.interfaces';
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
  styleUrls: ['./gestionar-usuarios.component.scss']
})

export class GestionarUsuariosComponent implements OnInit {
  visible = false;
  userForm!: FormGroup;
  selectedRoleId: string | null = null;
  selectedStatus: boolean | null = null;
  selectedUsuario: UpdateUsuario | null = null;

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
      console.log('Modal state changed:', state);
      console.log('selectedUsuario:', this.selectedUsuario);
      this.visible = state;
      if (!state) {
        this.resetForm();
      }
    });

    this.modalService.modalData$.subscribe(data => {
      console.log('Modal data received:', data);
      if (data) {
        this.editarUsuario(data as Usuario);
      }
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
      this.selectedStatus = value === 'active';
    });
  }

  private cargarRoles() {
    this.rolesService.obtenerRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  private initForm() {
    const passwordValidators = this.selectedUsuario ? [] : [Validators.required, Validators.minLength(6)];
    const formValidators = this.selectedUsuario ? [] : [this.passwordsMatchValidator];

    const baseForm = {
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      estado: ['active', Validators.required]
    };

    if (!this.selectedUsuario) {
      // Campos adicionales solo para creación
      Object.assign(baseForm, {
        contrasena: [null, passwordValidators],
        repassword: [null, [Validators.required]],
        rol: ['', Validators.required]
      });
    }

    this.userForm = this.fb.group(baseForm, { validators: formValidators });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log('Datos del formulario:', formData);

      const userData: Partial<CreateUsuario> = {
        nombre: formData.nombre,
        correo: formData.correo,
        estado: formData.estado
      };

      if (this.selectedUsuario) {
        console.log('Modo edición - Usuario seleccionado:', this.selectedUsuario);
        const updateData = {
          ...userData,
          id: this.selectedUsuario.id,
        } as UpdateUsuario;
        console.log('Datos de actualización:', updateData);

        this.usuariosService.editarUsuario(updateData).subscribe({
          next: (response) => {
            console.log('Respuesta exitosa de actualización:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Usuario actualizado correctamente'
            });
            this.eventsService.refreshUsers();
            this.modalService.closeModal();
          },
          error: (error) => {
            console.error('Error detallado al actualizar usuario:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Error al actualizar el usuario'
            });
          }
        });
      } else {
        // Modo creación - agregar campos adicionales
        userData.contrasena = formData.contrasena;
        userData.roles = [formData.rol];

        this.usuariosService.crearUsuario(userData as CreateUsuario).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Usuario creado correctamente'
            });
            this.eventsService.refreshUsers();
            this.modalService.closeModal();
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Error al crear el usuario'
            });
          }
        });
      }
    }
  }

  private resetForm() {
    this.selectedUsuario = null;
    if (this.userForm) {
      this.initForm();
    }
  }

  private editarUsuario(usuario: Usuario) {
    this.selectedUsuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      estado: usuario.estado ? 'active' : 'inactive'
    };

    this.initForm();
    this.userForm.patchValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      estado: usuario.estado ? 'active' : 'inactive'
    });
  }

  closeModal = () => {
    this.modalService.closeModal();
    this.resetForm();
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
