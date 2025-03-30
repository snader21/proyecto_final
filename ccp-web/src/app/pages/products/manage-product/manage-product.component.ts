import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ModalService } from '../../../services/products/modal.service';
import { ProductsService } from '../../../services/products/products.service';
import { EventsService } from '../../../services/events/events.service';
import { Category, Brand, Unit, Product, Maker, Status } from '../../../interfaces/product.interfaces';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { MessageService} from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { HttpClientModule } from '@angular/common/http';



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
  categories: Category[] = [];
  selectedCategory: Category | null = null;

  brands: Brand[] = [];
  selectedBrand: Brand | null = null;

  units: Unit[] = [];
  selectedUnit: Unit | null = null;

  makers: Maker[] = [
    { code: 'ELEC', name: 'Samsung' },
    { code: 'FOOD', name: 'Apple' },
    { code: 'CLTH', name: 'Adidas' },
    { code: 'HOME', name: 'Puma' }
  ];
  selectedMaker: Maker | null = null;

  statuses: Status[] = [
    { code: 'ACTIVO', name: 'Activo' },
    { code: 'INACTIVO', name: 'Inactivo' }
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
    private fb: FormBuilder,
    private productsService: ProductsService,
    private eventsService: EventsService
  ) {
    this.modalService.modalState$.subscribe(state => {
      console.log('state', state);
      this.visible = state;
    });
  }

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.loadBrands();
    this.loadUnits();

    this.productForm.get('category')?.valueChanges.subscribe(value => {
      this.selectedCategory = value;
    });
    this.productForm.get('brand')?.valueChanges.subscribe(value => {
      this.selectedBrand = value;
    });
    this.productForm.get('unit')?.valueChanges.subscribe(value => {
      this.selectedUnit = value;
    });
  }

  private loadCategories() {
    this.productsService.getCategories().subscribe(categories => {
      this.categories = categories.map(c => ({
        ...c,
        code: c.id_categoria,
        name: c.nombre
      }));
    });
  }

  private loadBrands() {
    this.productsService.getBrands().subscribe(brands => {
      this.brands = brands.map(b => ({
        ...b,
        code: b.id_marca,
        name: b.nombre
      }));
    });
  }

  private loadUnits() {
    this.productsService.getUnits().subscribe(units => {
      this.units = units.map(u => ({
        ...u,
        code: u.id_unidad_medida,
        name: u.nombre
      }));
    });
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
      const product = this.productForm.value;
      console.log('category:', this.selectedCategory);
      const productToSave = {
        nombre: product.name,
        sku: product.sku,
        descripcion: product.description,
        categoria: { id_categoria: this.selectedCategory?.id_categoria || '' },
        marca: { id_marca: this.selectedBrand?.id_marca || '' },
        unidad_medida: { id_unidad_medida: this.selectedUnit?.id_unidad_medida || '' },
        pais: { id_pais: "550e8400-e29b-41d4-a716-446655440000" },
        id_fabricante: 'DELL-001',
        activo: product.status === 'activo',
        precio: 0,
        alto: 0,
        ancho: 0,
        largo: 0,
        peso: 0,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date()
      };
      console.log('Product to save:', productToSave);
      this.productsService.saveProduct(productToSave).subscribe(
        savedProduct => {
          this.messageService.add({
            key: 'success',
            severity: 'success',
            summary: 'Éxito',
            detail: 'El producto se ha guardado correctamente',
            life: 3000
          });
          this.eventsService.refreshProducts();
          this.closeModal();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el producto',
            life: 3000
          });
        }
      );
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
