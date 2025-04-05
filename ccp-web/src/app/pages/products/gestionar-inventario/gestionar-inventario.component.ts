import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import {
  MovimientoInventario,
  Product,
} from "../../../interfaces/product.interfaces";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ProductsService } from "../../../services/productos/products.service";
import { firstValueFrom } from "rxjs";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { SelectModule } from "primeng/select";
import { ToastModule } from "primeng/toast";
import { DatePickerModule } from "primeng/datepicker";
@Component({
  selector: "app-gestionar-inventario",
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SelectModule,
    ReactiveFormsModule,
    DatePickerModule,
    ToastModule,
  ],
  templateUrl: "./gestionar-inventario.component.html",
  styleUrl: "./gestionar-inventario.component.scss",
})
export class GestionarInventarioComponent implements OnInit {
  @Input() product?: Product;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<boolean>();

  form!: FormGroup;
  loading = true;
  ubicacionesRaw: any[] = [];
  ubicaciones: any[] = [];
  bodegas: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly productsService: ProductsService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadForm();
  }

  private initForm() {
    this.form = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(1)]],
      bodega: [null, Validators.required],
      ubicacion: [null, Validators.required],
      fechaRegistro: [
        new Date(),
        Validators.required,
        // this.fechaRegistroNoEsMayorQueHoy,
      ],
    });
  }

  async loadForm() {
    this.loading = true;
    try {
      const response = await firstValueFrom(
        this.productsService.getUbicaciones()
      );
      this.ubicacionesRaw = response;
      response.forEach((ubicacion) => {
        if (
          !this.bodegas.find(
            (bodega) => bodega.value === ubicacion.bodega.id_bodega
          )
        ) {
          this.bodegas.push({
            label: ubicacion.bodega.nombre,
            value: ubicacion.bodega.id_bodega,
            ubicaciones: ubicacion.ubicaciones,
          });
        }
      });
    } finally {
      this.loading = false;
    }
  }

  onBodegaChange(event: any) {
    const selectedBodega = this.bodegas.find(
      (bodega) => bodega.value === event.value
    );

    if (selectedBodega) {
      this.ubicaciones = this.ubicacionesRaw
        .filter((ubicacion) => {
          return ubicacion.bodega.id_bodega === selectedBodega.value;
        })
        .map((ubicacion) => {
          return {
            label: ubicacion.nombre,
            value: ubicacion.id_ubicacion,
          };
        });
    }
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
        "Por favor complete todos los campos correctamente"
      );
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const payload: any = {
      idProducto: this.product?.id_producto,
      cantidad: parseInt(this.form.value.cantidad),
      idUbicacion: this.form.value.ubicacion,
      fechaRegistro: new Date(),
      tipoMovimiento: "Entrada",
      idUsuario: usuario?.id,
    };
    try {
      await firstValueFrom(this.productsService.generarEntrada(payload));
      this.showSuccessMessage("La entrada se ha guardado correctamente");
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
      summary: "Éxito",
      detail,
      life: 3000,
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) return "";
    if (control.hasError("required")) return "Este campo es requerido";
    if (control.hasError("min")) return "El valor mínimo es 1";
    if (control.hasError("fechaRegistroNoEsMayorQueHoy"))
      return "La fecha de registro no puede ser mayor que la fecha actual";
    return "";
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  onHide() {
    this.visibleChange.emit(false);
  }

  fechaRegistroNoEsMayorQueHoy(
    control: AbstractControl
  ): ValidationErrors | null {
    const fechaRegistro = control.value;
    const fechaActual = new Date();
    if (fechaRegistro > fechaActual) {
      return { fechaRegistroNoEsMayorQueHoy: true };
    }
    return null;
  }
}
