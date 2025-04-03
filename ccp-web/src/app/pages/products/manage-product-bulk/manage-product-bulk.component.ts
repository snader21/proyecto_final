import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ModalService } from '../../../services/products/modal.service';
import { ProductsService } from '../../../services/products/products.service';

@Component({
  selector: 'app-manage-product-bulk',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TabsModule,
    FileUploadModule,
    TableModule,
    TagModule,
    ButtonModule
  ],
  templateUrl: './manage-product-bulk.component.html',
  styleUrl: './manage-product-bulk.component.scss'
})
export class ManageProductBulkComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: any;

  visible = false;
  file: File | null = null;
  uploadStatus: { success: boolean; message: string } | null = null;
  csvFiles: any[] = [];

  constructor(
    private modalService: ModalService,
    private productsService: ProductsService
  ) {
    this.modalService.bulkModalState$.subscribe(state => {
      this.visible = state;
      if (state) {
        this.loadCSVFiles();
      }
    });
  }

  ngOnInit() {
    this.loadCSVFiles();
  }

  closeModal() {
    this.modalService.closeBulkModal();
  }

  uploadCSV(event: { files: File[] }) {
    if (event.files && event.files.length > 0) {
      this.file = event.files[0];
      const formData = new FormData();
      formData.append('file', this.file);

      this.productsService.uploadCSV(formData).subscribe({
        next: (response: { url: string }) => {
          this.uploadStatus = {
            success: true,
            message: 'Archivo cargado exitosamente'
          };
          this.fileUpload.clear();
          this.file = null;
          this.loadCSVFiles();
        },
        error: (error: Error) => {
          this.uploadStatus = {
            success: false,
            message: 'Error al cargar el archivo'
          };
        }
      });
    }
  }

  loadCSVFiles() {
    this.productsService.getCSVFiles().subscribe(files => {
      console.log(files);
      this.csvFiles = files;
    });
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" {
    switch (status) {
      case 'pendiente': return 'warn';
      case 'procesado': return 'success';
      case 'error': return 'danger';
      default: return 'info';
    }
  }

  downloadFile(file: any) {
    window.open(file.url, '_blank');
  }
}
