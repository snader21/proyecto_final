import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ModalService } from '../../../services/productos/modal.service';
import { ProductsService } from '../../../services/productos/products.service';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-product-bulk',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabsModule,
    FileUploadModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './manage-product-bulk.component.html',
  styleUrls: ['./manage-product-bulk.component.scss']
})
export class ManageProductBulkComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload: any;

  visible = false;
  errorDialogVisible = false;
  file: File | null = null;
  uploadStatus: { success: boolean; message: string } | null = null;
  csvFiles: any[] = [];
  currentFileErrors: any[] = [];
  loading = false;
  private updateSubscription?: Subscription;

  constructor(
    private modalService: ModalService,
    private productsService: ProductsService,
    private messageService: MessageService
  ) {
    this.modalService.bulkModalState$.subscribe(state => {
      this.visible = state;
      if (state) {
        this.startAutoUpdate();
      }
    });
  }

  ngOnInit() {
    this.startAutoUpdate();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
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
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la lista de archivos'
          });
        }
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

  uploadFile() {
    if (this.file) {
      this.loading = true;
      const formData = new FormData();
      formData.append('file', this.file);

      this.productsService.uploadCSV(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivo cargado correctamente'
          });
          this.fileUpload.clear();
          this.file = null;
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar el archivo'
          });
          this.loading = false;
        }
      });
    }
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch (status) {
      case 'pendiente': return 'warn';
      case 'procesado': return 'success';
      case 'parcial': return 'info';
      case 'error': return 'danger';
      default: return 'info';
    }
  }

  getErrorSummary(file: any): string {
    if (file.estado !== 'error' || !file.errores_procesamiento?.length) {
      return '';
    }

    const totalErrors = file.errores_procesamiento.length;
    const firstError = file.errores_procesamiento[0].error;
    
    return `
      <div class="text-sm">
        <div><strong>Total errores:</strong> ${totalErrors}</div>
        <div><strong>Primer error:</strong> ${firstError}</div>
        ${totalErrors > 1 ? '<div class="text-xs">(Click en el ícono de error para ver todos)</div>' : ''}
      </div>
    `;
  }

  showErrorDetails(file: any) {
    this.currentFileErrors = file.errores_procesamiento;
    this.errorDialogVisible = true;
  }

  downloadFile(file: any) {
    window.open(file.url, '_blank');
  }
}
