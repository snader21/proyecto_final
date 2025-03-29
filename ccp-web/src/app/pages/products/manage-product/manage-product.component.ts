import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ModalService } from '../../../services/products/modal.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { MessageService} from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { HttpClientModule } from '@angular/common/http';

interface Category {
  code: string;
  name: string;
}

interface Brand {
  code: string;
  name: string;
}

interface Maker {
  code: string;
  name: string;
}

interface Unit {
  code: string;
  name: string;
}

interface Status {
  code: string;
  name: string;
}

interface Product {
  sku: string;
  name: string;
  description: string;
  category: Category | null;
  brand: Brand | null;
  maker: Maker | null;
  unit: Unit | null;
  measurement: string;
  status: Status | null;
}

@Component({
  selector: 'app-manage-product',
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
  ],
  providers: [MessageService],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
  visible = false;
  categories: Category[] = [
    { code: 'ELEC', name: 'Electrónicos' },
    { code: 'FOOD', name: 'Alimentos' },
    { code: 'CLTH', name: 'Ropa' },
    { code: 'HOME', name: 'Hogar' },
    { code: 'SPRT', name: 'Deportes' }
  ];
  selectedCategory: Category | null = null;

  brands: Brand[] = [
    { code: 'ELEC', name: 'Samsung' },
    { code: 'FOOD', name: 'Apple' },
    { code: 'CLTH', name: 'Adidas' },
    { code: 'HOME', name: 'Puma' }
  ];
  selectedBrand: Brand | null = null;

  makers: Maker[] = [
    { code: 'ELEC', name: 'Samsung' },
    { code: 'FOOD', name: 'Apple' },
    { code: 'CLTH', name: 'Adidas' },
    { code: 'HOME', name: 'Puma' }
  ];
  selectedMaker: Maker | null = null;

  units: Unit[] = [
    { code: 'ELEC', name: 'Electrónicos' },
    { code: 'FOOD', name: 'Alimentos' },
    { code: 'CLTH', name: 'Ropa' },
    { code: 'HOME', name: 'Hogar' },
    { code: 'SPRT', name: 'Deportes' }
  ];
  selectedUnit: Unit | null = null;

  statuses: Status[] = [
    { code: 'ELEC', name: 'Activo' },
    { code: 'FOOD', name: 'Inactivo' }
  ];
  selectedStatus: Status | null = null;

  productForm!: FormGroup;

  files: any[] = [];
  uploadedFiles: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private config: PrimeNG,
    private fb: FormBuilder
  ) {
    this.modalService.modalState$.subscribe(state => {
      console.log('state', state);
      this.visible = state;
    });
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.productForm = this.fb.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [null, Validators.required],
      brand: [null, Validators.required],
      maker: [null, Validators.required],
      unit: [null, Validators.required],
      measurement: ['', Validators.required],
      status: [null, Validators.required]
    });
  }

  closeModal() {
    this.modalService.closeModal();
    this.resetForm();
  }

  resetForm() {
    this.productForm.reset();
    this.files = [];
    this.uploadedFiles = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form submitted:', this.productForm.value);
      // Aquí iría la lógica para guardar el producto
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Producto guardado correctamente',
        life: 3000
      });
      this.closeModal();
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
  });
  this.totalSizePercent = this.totalSize / 10;
}

  onRemoveTemplatingFile(event: Event, file: any, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  choose(event: Event, chooseCallback: any) {
    chooseCallback();
  }

  uploadEvent(uploadCallback: any) {
    uploadCallback();
  }

  formatSize(bytes: number) {
    if (!this.config || !this.config.translation || !this.config.translation.fileSizeTypes) {
      return '0 bytes';
    }
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
}

}
