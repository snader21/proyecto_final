import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ModalService } from "../../../services/productos/modal.service";
import { ProductsService } from "../../../services/productos/products.service";
import { MessageService } from "primeng/api";
import { interval, Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

// Regex para validar el formato del SKU (ejemplo: ABC-123, ABC123, ABC_123)
const SKU_REGEX = /^[A-Za-z0-9]{3,}-?\d{3,}$/;

interface ImageFile {
  nombre_archivo: string;
  sku: string;
  estado: string;
  total_imagenes: number;
  imagenes_cargadas: number;
  fecha_carga: Date;
  url?: string;
  preview_url?: string;
  error?: string;
}

@Component({
  selector: "app-manage-product-bulk",
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabViewModule,
    FileUploadModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: "./manage-product-bulk.component.html",
  styleUrls: ["./manage-product-bulk.component.scss"],
})
export class ManageProductBulkComponent implements OnInit, OnDestroy {
  @ViewChild("fileUpload") fileUpload: any;
  @ViewChild("imageUpload") imageUpload: any;

  visible = false;
  errorDialogVisible = false;
  imagePreviewVisible = false;
  file: File | null = null;
  uploadStatus: { success: boolean; message: string } | null = null;
  csvFiles: any[] = [];
  imageFiles: ImageFile[] = [];
  currentFileErrors: any[] = [];
  selectedImageUrl: string | null = null;
  invalidFileNames: string[] = [];
  hasValidationErrors = false;
  loading = false;
  private updateSubscription?: Subscription;
  private imageUpdateSubscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) {
    this.modalService.bulkModalState$.subscribe((state) => {
      this.visible = state;
      if (state) {
        this.startAutoUpdate();
        this.startImageAutoUpdate();
      }
    });
  }

  ngOnInit() {
    this.startAutoUpdate();
    this.startImageAutoUpdate();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.imageUpdateSubscription) {
      this.imageUpdateSubscription.unsubscribe();
    }
  }

  private startAutoUpdate() {
    this.updateSubscription = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.productsService.getCSVFiles())
      )
      .subscribe({
        next: (files) => {
          this.csvFiles = files;
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error al actualizar la lista de archivos",
          });
        },
      });
  }

  private startImageAutoUpdate() {
    this.imageUpdateSubscription = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.productsService.getImageFiles())
      )
      .subscribe({
        next: (files) => {
          this.imageFiles = files;
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error al actualizar la lista de imágenes",
          });
        },
      });
  }

  closeModal() {
    this.modalService.closeBulkModal();
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.file = event.files[0];
    }
  }

  onImageSelect(event: any) {
    this.invalidFileNames = [];
    this.hasValidationErrors = false;
    const files = event.files;
    
    if (!files || files.length === 0) return;

    // Validar el número de archivos
    if (files.length > 25) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pueden cargar más de 25 imágenes a la vez'
      });
      this.hasValidationErrors = true;
      this.imageUpload.clear();
      return;
    }

    // Validar cada archivo
    files.forEach((file: File) => {
      const fileName = file.name.split('.')[0];
      
      // Validar formato del archivo
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `El archivo ${file.name} debe ser una imagen en formato PNG o JPEG`
        });
        this.hasValidationErrors = true;
      }

      // Validar tamaño del archivo
      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `El archivo ${file.name} excede el tamaño máximo permitido de 10 MB`
        });
        this.hasValidationErrors = true;
      }

      // Validar nombre del archivo (SKU)
      if (!this.isValidSKU(fileName)) {
        this.invalidFileNames.push(file.name);
        this.hasValidationErrors = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `El archivo ${file.name} no cumple con el formato de SKU requerido (ejemplo: ABC-123)`
        });
      }
    });

    // Si hay errores, limpiar la selección
    if (this.hasValidationErrors) {
      this.imageUpload.clear();
    }
  }

  onImageUploadError(event: any) {
    if (event.type === 'max-file-limit') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pueden cargar más de 25 imágenes a la vez',
      });
    } else if (event.type === 'max-size') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El archivo ${event.file.name} excede el tamaño máximo permitido de 10 MB`,
      });
    } else if (event.type === 'type') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El archivo ${event.file.name} debe ser una imagen en formato PNG o JPEG`,
      });
    }
    this.hasValidationErrors = true;
    this.imageUpload.clear();
  }

  uploadFile() {
    if (this.file) {
      this.loading = true;
      const formData = new FormData();
      formData.append("file", this.file);

      this.productsService.uploadCSV(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Archivo cargado correctamente",
          });
          this.fileUpload.clear();
          this.file = null;
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Error al cargar el archivo",
          });
          this.loading = false;
        },
      });
    }
  }

  uploadImages() {
    const fileUpload = this.imageUpload;
    if (!fileUpload || !fileUpload.files || fileUpload.files.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay archivos seleccionados para cargar',
      });
      return;
    }

    // Verificar si hay errores de validación
    if (this.hasValidationErrors || this.invalidFileNames.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hay errores en los archivos seleccionados. Por favor, corrija los errores antes de cargar.',
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();
    
    for (let file of fileUpload.files) {
      formData.append("images", file);
    }

    this.productsService.uploadImages(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: "Imágenes cargadas correctamente",
        });
        fileUpload.clear();
        this.loading = false;
        this.invalidFileNames = [];
        this.hasValidationErrors = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.message || "Error al cargar las imágenes",
        });
        this.loading = false;
      },
    });
  }

  private isValidSKU(fileName: string): boolean {
    // Validar que el nombre del archivo siga el formato de SKU
    return SKU_REGEX.test(fileName);
  }

  getStatusSeverity(
    status: string
  ): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch (status) {
      case "pendiente":
        return "warn";
      case "procesado":
        return "success";
      case "parcial":
        return "info";
      case "error":
        return "danger";
      default:
        return "info";
    }
  }

  getErrorSummary(file: any): string {
    if (file.estado !== "error" || !file.errores_procesamiento?.length) {
      return "";
    }

    const totalErrors = file.errores_procesamiento.length;
    const firstError = file.errores_procesamiento[0].error;

    return `
      <div class="text-sm">
        <div><strong>Total errores:</strong> ${totalErrors}</div>
        <div><strong>Primer error:</strong> ${firstError}</div>
        ${
          totalErrors > 1
            ? '<div class="text-xs">(Click en el ícono de error para ver todos)</div>'
            : ""
        }
      </div>
    `;
  }

  showErrorDetails(file: any) {
    this.currentFileErrors = file.errores_procesamiento;
    this.errorDialogVisible = true;
  }

  showImageError(file: ImageFile) {
    if (file.error) {
      this.currentFileErrors = [{ error: file.error }];
      this.errorDialogVisible = true;
    }
  }

  viewImage(file: ImageFile) {
    if (file.url) {
      this.selectedImageUrl = file.url;
      this.imagePreviewVisible = true;
    }
  }

  downloadFile(file: any) {
    window.open(file.url, "_blank");
  }
}
