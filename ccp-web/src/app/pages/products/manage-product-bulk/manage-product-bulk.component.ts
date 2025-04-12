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
import { Subscription } from "rxjs";
import { UploadResult } from "../../../interfaces/upload-result.interface";

// Regex para validar el formato del SKU (ejemplo: ABC-123, ABC123, ABC_123)
const SKU_REGEX = /^[A-Za-z0-9]{3,}-?\d{3,}$/;

interface ImageFile {
  id_imagen?: string;
  nombre_archivo: string;
  key_object_storage?: string;
  url?: string;
  estado: string;
  total_imagenes: number;
  imagenes_cargadas: number;
  errores_procesamiento?: Array<{ error: string }>;
  fecha_carga: Date;
  preview_url?: string;
  producto?: {
    id_producto: string;
    nombre: string;
    sku: string;
  };
}

interface FileWithName extends File {
  name: string;
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
  selectedFile: ImageFile | null = null;
  private subscriptions = new Subscription();

  constructor(
    private modalService: ModalService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) {
    const modalSub = this.modalService.bulkModalState$.subscribe((state) => {
      this.visible = state;
      if (state) {
        this.loadCSVFiles();
        this.loadImageFiles();
      }
    });
    this.subscriptions.add(modalSub);
  }

  ngOnInit() {
    this.loadCSVFiles();
    this.loadImageFiles();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadCSVFiles() {
    const sub = this.productsService.getCSVFiles().subscribe({
      next: (files) => {
        this.csvFiles = files;
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar la lista de archivos",
        });
      },
    });
    this.subscriptions.add(sub);
  }

  private loadImageFiles() {
    const sub = this.productsService.getImageFiles().subscribe({
      next: (files) => {
        this.imageFiles = files;
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar la lista de imágenes",
        });
      },
    });
    this.subscriptions.add(sub);
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
    const files = Array.from(event.files);

    if (files.length > 25) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pueden cargar más de 25 imágenes a la vez'
      });
      this.imageUpload.clear();
      return;
    }

    let hasErrors = false;
    files.forEach((file: any) => {
      // Validar formato del archivo
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `El archivo ${file.name} debe ser una imagen en formato PNG o JPEG`
        });
        hasErrors = true;
      }

      // Validar tamaño del archivo (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `El archivo ${file.name} excede el tamaño máximo permitido de 10 MB`
        });
        hasErrors = true;
      }
    });

    if (hasErrors) {
      this.imageUpload.clear();
    }
  }

  onImageUploadError(event: any) {
    if (event.type === 'max-file-limit') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pueden cargar más de 25 imágenes a la vez'
      });
    } else if (event.type === 'max-size') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El archivo ${event.file.name} excede el tamaño máximo permitido de 10 MB`
      });
    } else if (event.type === 'type') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El archivo ${event.file.name} debe ser una imagen en formato PNG o JPEG`
      });
    }
  }

  uploadFile() {
    if (this.file) {
      this.loading = true;
      const formData = new FormData();
      formData.append("file", this.file);

      const sub = this.productsService.uploadCSV(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Archivo cargado correctamente",
          });
          this.fileUpload.clear();
          this.file = null;
          this.loading = false;
          this.loadCSVFiles();
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
      this.subscriptions.add(sub);
    }
  }

  uploadImages() {
    const fileUpload = this.imageUpload;
    if (!fileUpload || !fileUpload.files || fileUpload.files.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay archivos seleccionados para cargar'
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();

    const files = Array.from(fileUpload.files) as FileWithName[];
    files.forEach((file) => {
      formData.append('files', file);
    });

    const sub = this.productsService.uploadImages(formData).subscribe({
      next: (response: UploadResult) => {
        // Crear nuevo registro para la tabla
        const newImageFile: ImageFile = {
          nombre_archivo: files[0].name,
          estado: response.imagenes_error > 0 ? 'error' : 'procesado',
          total_imagenes: response.total_imagenes,
          imagenes_cargadas: response.imagenes_cargadas,
          fecha_carga: new Date(),
          errores_procesamiento: response.errores ? response.errores.map(error => ({ error })) : undefined
        };

        // Actualizar la lista de archivos
        this.imageFiles = [newImageFile, ...this.imageFiles];

        // Mostrar mensaje según el resultado
        this.messageService.add({
          severity: response.imagenes_error > 0 ? 'warn' : 'success',
          summary: response.imagenes_error > 0 ? 'Carga con Errores' : 'Carga Exitosa',
          detail: response.imagenes_error > 0 
            ? `No se pudieron cargar ${response.imagenes_error} de ${response.total_imagenes} imágenes` 
            : `Se cargaron correctamente ${response.imagenes_cargadas} imágenes`
        });

        fileUpload.clear();
        this.loading = false;
        this.loadImageFiles();
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.message || "Error al cargar las imágenes"
        });
        this.loading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  showProcessingResults(file: ImageFile) {
    if (file.errores_procesamiento?.length) {
      this.currentFileErrors = file.errores_procesamiento;
      this.selectedFile = file; // Store the selected file for the dialog
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
}
