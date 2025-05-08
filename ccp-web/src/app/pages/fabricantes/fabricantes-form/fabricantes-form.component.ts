import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FabricantesService } from '../../../services/fabricantes/fabricantes.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Fabricante } from '../../../interfaces/fabricante.interface';

@Component({
  selector: 'app-fabricantes-form',
  templateUrl: './fabricantes-form.component.html',
  styleUrls: ['./fabricantes-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SelectModule,
    ReactiveFormsModule,
    ToastModule
  ]
})
export class FabricantesFormComponent implements OnInit {
  @Input() fabricante: Fabricante | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<boolean>();

  form!: FormGroup;
  loading = true;
  ciudades: any[] = [];
  paises: any[] = [];
  estados = [
    { label: $localize`:@@estadoActivo:Activo`, value: 'activo' },
    { label: $localize`:@@estadoInactivo:Inactivo`, value: 'inactivo' }
  ];
  esPrimeraCarga = true;
  dialogTitleAdd: string = $localize`:@@tituloAgregarFabricante:Agregar fabricante`;
  dialogTitleEdit: string = $localize`:@@tituloEditarFabricante:Editar fabricante`;


  constructor(
    private readonly fb: FormBuilder,
    private readonly fabricantesService: FabricantesService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadForm();
  }

  private initForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      ciudad_id: ['', Validators.required],
      pais_id: ['', Validators.required],
      estado: ['activo', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  async loadForm() {
    this.loading = true;
    try {
      if (this.fabricante) this.populateForm();
      await this.fetchPaises();
      await this.loadCiudades();
    } finally {
      this.loading = false;
    }
  }

  private populateForm() {
    this.esPrimeraCarga = true;
    this.form.patchValue(this.fabricante!);
  }

  async loadCiudades() {
    const paisId = this.form.get('pais_id')?.value;
    if (!this.esPrimeraCarga) this.form.get('ciudad_id')?.reset();
    if (paisId) {
      this.form.get('ciudad_id')?.enable();
      this.ciudades = await this.fetchCiudades(paisId);
    } else {
      this.form.get('ciudad_id')?.disable();
      this.ciudades = await this.fetchCiudades();
    }
    this.esPrimeraCarga = false;
  }

  private async fetchCiudades(paisId?: string): Promise<any[]> {
    const response = paisId
      ? await this.fabricantesService.getCiudadesByPais(paisId)
      : await this.fabricantesService.getCiudades();
    return response.map(ciudad => ({ label: ciudad.nombre, value: ciudad.id }));
  }

  private async fetchPaises() {
    const response = await this.fabricantesService.getPaises();
    this.paises = response.map(pais => ({ label: pais.nombre, value: pais.id }));
  }

  hideDialog() {
    this.visibleChange.emit(false);
    this.form.reset();
    this.loading = true;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.showErrorMessage($localize`:@@formularioFabricanteInvalido:Por favor complete todos los campos correctamente`);
      return;
    }
    try {
      if (this.fabricante) {
        await this.fabricantesService.updateFabricante(this.fabricante.id!, this.form.value);
      } else {
        await this.fabricantesService.createFabricante(this.form.value);
      }
      this.showSuccessMessage($localize`:@@fabricanteGuardado:El fabricante se ha guardado correctamente`);
      this.success.emit(true);
      this.hideDialog();
    } catch (error: any) {
      this.showErrorMessage(error.error.message);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showErrorMessage(detail: string) {
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: $localize`:@@tituloDeErrorFabricante:Error`,
      detail
    });
  }

  private showSuccessMessage(detail: string) {
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: $localize`:@@tituloDeExitoFabricante:Éxito`,
      detail,
      life: 3000
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) return '';
    if (control.hasError('required')) {
      return $localize`:@@campoFabricanteRequerido:Este campo es requerido`;
    }
    if (control.hasError('email')) {
      return $localize`:@@validacionCorreoFabricante:Por favor ingrese un correo electrónico válido`;
    }
    if (control.hasError('minlength')) {
      return $localize`:@@validacionLongitudMinimaFabricante:El campo debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control.hasError('pattern')) {
      return $localize`:@@validaciontelefonoFabricante:Por favor ingrese un número de teléfono válido (10 dígitos)`;
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
