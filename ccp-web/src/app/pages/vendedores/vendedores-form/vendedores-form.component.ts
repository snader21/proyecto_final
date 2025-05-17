import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { SelectModule } from "primeng/select";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { VendedoresService } from "../../../services/vendedores/vendedores.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Vendedor } from "../../../interfaces/vendedor.interface";
import { RolesService } from "../../../services/roles/roles.service";
import { firstValueFrom } from "rxjs";
@Component({
  selector: "app-vendedores-form",
  templateUrl: "./vendedores-form.component.html",
  styleUrls: ["./vendedores-form.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SelectModule,
    ReactiveFormsModule,
    ToastModule,
  ],
})
export class VendedoresFormComponent implements OnInit {
  @Input() vendedor: Vendedor | null = null;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<boolean>();

  form!: FormGroup;
  loading = true;
  zonas: any[] = [];
  rolVendedorId: string | undefined = undefined;
  estados = [
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" },
  ];
  esPrimeraCarga = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly vendedoresService: VendedoresService,
    private readonly messageService: MessageService,
    private readonly rolesService: RolesService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadForm();
  }

  private initForm() {
    this.form = this.fb.group(
      {
        nombre: ["", [Validators.required, Validators.minLength(3)]],
        contrasena: ["", [Validators.required, Validators.minLength(6)]],
        confirmacion_contrasena: [
          "",
          [Validators.required, Validators.minLength(6)],
        ],
        correo: ["", [Validators.required, Validators.email]],
        telefono: [
          "",
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
        zona_id: ["", Validators.required],
        estado: ["Activo", Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  async loadForm() {
    this.loading = true;
    try {
      if (this.vendedor) this.populateForm();
      await this.loadZonas();
      await this.obtenerRolVendedor();
    } finally {
      this.loading = false;
    }
  }

  private populateForm() {
    this.esPrimeraCarga = true;
    this.form.patchValue(this.vendedor!);
  }

  async obtenerRolVendedor() {
    try {
      const response = await firstValueFrom(this.rolesService.obtenerRoles());
      this.rolVendedorId = response.find(
        (role: any) => role.nombre === "Vendedor"
      )?.id;
    } catch (error) {
      this.rolVendedorId = "867ec9ad-632b-464e-aae1-a194a3ec017f";
    }
  }

  async loadZonas() {
    const response = await this.vendedoresService.getZonas();
    this.zonas = response.map((zona) => ({
      label: zona.nombre,
      value: zona.id,
    }));
  }

  hideDialog() {
    this.visibleChange.emit(false);
    this.form.reset();
    this.loading = true;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.showErrorMessage(
        $localize`:@@vendedoresFormError:Por favor complete todos los campos correctamente`
      );
      return;
    }
    const payload: any = {
      nombre: this.form.value.nombre,
      correo: this.form.value.correo,
      telefono: this.form.value.telefono,
      zonaId: this.form.value.zona_id,
      estado: this.form.value.estado,
      roles: [this.rolVendedorId],
      contrasena: this.form.value.contrasena,
    };
    try {
      if (this.vendedor) {
        await this.vendedoresService.updateVendedor(this.vendedor.id!, payload);
      } else {
        await this.vendedoresService.createVendedor(payload);
      }
      this.showSuccessMessage(
        $localize`:@@vendedoresFormSuccessMessage:El vendedor se ha guardado correctamente`
      );
      this.success.emit(true);
      this.hideDialog();
    } catch (error: any) {
      this.showErrorMessage(error.error.message);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showErrorMessage(detail: string) {
    this.messageService.add({
      key: "error",
      severity: "error",
      summary: "Error",
      detail,
    });
  }

  private showSuccessMessage(detail: string) {
    this.messageService.add({
      key: "success",
      severity: "success",
      summary: $localize`:@@vendedoresFormSuccessSummary:Éxito`,
      detail,
      life: 3000,
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) return "";
    if (control.hasError("required"))
      return $localize`:@@vendedoresFormErrorRequired:Este campo es requerido`;
    if (control.hasError("email"))
      return $localize`:@@vendedoresFormErrorEmail:Por favor ingrese un correo electrónico válido`;
    if (control.hasError("minlength"))
      return $localize`:@@vendedoresFormErrorMinlength:El campo debe tener al menos ${control.errors?.["minlength"].requiredLength} caracteres`;
    if (control.hasError("minlength"))
      return $localize`:@@vendedoresFormErrorMinlength:El campo debe tener al menos ${control.errors?.["minlength"].requiredLength} caracteres`;
    if (control.hasError("passwordsMismatch"))
      return $localize`:@@vendedoresFormErrorPasswordsMismatch:Las contraseñas no coinciden`;
    if (control.hasError("pattern"))
      return $localize`:@@vendedoresFormErrorPattern:El campo debe contener máximo 10 números`;
    return "";
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const contrasena = control.get("contrasena")?.value;
    const confirmPassword = control.get("confirmacion_contrasena")?.value;

    if (contrasena !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
