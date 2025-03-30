import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

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
    ReactiveFormsModule
  ]
})
export class FabricantesFormComponent implements OnInit {
  @Input() fabricante: any = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  form: FormGroup;
  loading = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly alertService: AlertService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      status: ['Activo', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit() {}
  
  loadForm() {
    this.loading = true;
    if (this.fabricante) {
      this.form.patchValue(this.fabricante);
    }
    this.loading = false;
  }

  hideDialog() {
    this.visibleChange.emit(false);
    this.form.reset();
    this.loading = true;
  }

  onSubmit() {
    if (this.form.valid) {
      // Aquí iría la lógica para guardar el fabricante
      this.alertService.showAlert(
        'success',
        'Datos guardados correctamente',
        'Los datos se han guardado correctamente'
      );
      this.hideDialog();
    } else {
      this.markFormGroupTouched(this.form);
      this.alertService.showAlert(
        'error',
        'Error',
        'Por favor complete todos los campos correctamente'
      );
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

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Por favor ingrese un correo electrónico válido';
    }
    if (control?.hasError('minlength')) {
      return `El campo debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Por favor ingrese un número de teléfono válido (10 dígitos)';
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
