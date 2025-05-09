import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { RippleModule } from 'primeng/ripple';
import { ModalService } from "../../../services/productos/modal.service";
import { ProductsService } from "../../../services/productos/products.service";
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { UploadResult } from "../../../interfaces/upload-result.interface";
import { finalize } from "rxjs/operators";

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
  templateUrl: "./manage-product-bulk.component.html",
  styleUrls: ["./manage-product-bulk.component.scss"],
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
    RippleModule
  ],
})
export class ManageProductBulkComponent implements OnInit, OnDestroy {
  @ViewChild("fileUpload") fileUpload: any;
  @ViewChild("imageUpload") imageUpload: any;
  @Output() modalClosed = new EventEmitter<void>();

  visible = false;
  errorDialogVisible = false;
  file: File | null = null;
  uploadStatus: { success: boolean; message: string } | null = null;
  csvFiles: any[] = [];
  imageFiles: ImageFile[] = [];
  currentFile: any = null;
  currentFileErrors: any[] = [];
  invalidFileNames: string[] = [];
  hasValidationErrors = false;
  loading = false;
  selectedFile: ImageFile | null = null;
  private subscriptions = new Subscription();
  activeTabIndex = 0;

  constructor(
    private modalService: ModalService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) {
    const modalSub = this.modalService.bulkModalState$.subscribe((state) => {
      this.visible = state;
      if (state) {
        this.loadCSVFiles();
      }
      if (!state) {
        this.modalClosed.emit();
      }
    });
    this.subscriptions.add(modalSub);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.imageUpload) {
      this.imageUpload.clear();
    }
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

    const uploadSub = this.productsService.uploadImages(formData)
      .pipe(
        finalize(() => {
          fileUpload.clear();
          this.loading = false;
        })
      )
      .subscribe({
        next: (response: UploadResult) => {
          console.log('Upload response:', response);

          // Determinar el estado basado en las imágenes cargadas
          let estado: string;
          if (response.total_imagenes === response.imagenes_error) {
            estado = 'error';
          } else if (response.total_imagenes !== response.imagenes_cargadas) {
            estado = 'parcial';
          } else {
            estado = 'procesado';
          }

          // Crear nuevo registro para la tabla
          const newImageFile: ImageFile = {
            nombre_archivo: files[0].name,
            estado: estado,
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
            summary: estado === 'parcial' ? 'Carga Parcial' : (response.imagenes_error > 0 ? 'Carga con Errores' : 'Carga Exitosa'),
            detail: response.imagenes_error > 0
              ? `No se pudieron cargar ${response.imagenes_error} de ${response.total_imagenes} imágenes`
              : estado === 'parcial'
                ? `Se cargaron ${response.imagenes_cargadas} de ${response.total_imagenes} imágenes`
                : `Se cargaron correctamente ${response.imagenes_cargadas} imágenes`
          });
        },
        error: (error) => {
          console.error('Error en la carga de imágenes:', error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error?.message || "Error al cargar las imágenes"
          });
        }
      });

    this.subscriptions.add(uploadSub);
  }

  showErrorDetails(file: any) {
    this.currentFile = file;
    this.currentFileErrors = file.errores_procesamiento?.map((error: any) => {
      if (typeof error === 'string') {
        return {
          mensaje: error,
          fila: 'N/A'
        };
      }
      return {
        mensaje: error.error || error.mensaje || 'Error desconocido',
        fila: error.fila || error.linea || 'N/A'
      };
    }) || [];
    this.errorDialogVisible = true;
  }

  showProcessingResults(file: any) {
    this.currentFile = file;
    this.currentFileErrors = file.errores_procesamiento?.map((error: any) => {
      if (typeof error === 'string') {
        return {
          mensaje: error,
          fila: 'N/A'
        };
      }
      return {
        mensaje: error.error || error.mensaje || 'Error desconocido',
        fila: error.fila || error.linea || 'N/A'
      };
    }) || [];
    this.errorDialogVisible = true;
  }

  closeErrorDialog() {
    this.errorDialogVisible = false;
    this.currentFile = null;
    this.currentFileErrors = [];
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

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }
}
