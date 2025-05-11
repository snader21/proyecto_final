import { Component, OnInit } from '@angular/core';
import { FabricantesService } from '../../../services/fabricantes/fabricantes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ModalService } from '../../../services/productos/modal.service';
import { ProductsService } from '../../../services/productos/products.service';
import { EventsService } from '../../../services/events/events.service';
import { Category, Brand, Unit, Product, Maker, Status } from '../../../interfaces/product.interfaces';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { MessageService} from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { Fabricante } from '../../../interfaces/fabricante.interface';

interface ImagenProducto {
  id_imagen?: string;
  url: string;
  key_object_storage?: string;
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
    BadgeModule,
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

  makers: Fabricante[] = [];
  selectedMaker: Fabricante | null = null;

  statuses: Status[] = [
    { code: 'ACTIVO', name: 'Activo' },
    { code: 'INACTIVO', name: 'Inactivo' }
  ];
  selectedStatus: Status | null = null;

  productForm!: FormGroup;

  files: any[] = [];
  uploadedFiles: Array<{
    name: string;
    objectURL: string;
    size: number;
    type: string;
  }> = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  editMode = false;
  editingProduct: Product | null = null;

  config = {
    translation: {
      fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    }
  };

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private fabricantesService: FabricantesService,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private eventsService: EventsService
  ) {
    this.modalService.modalState$.subscribe(state => {
      this.visible = state;
      if (!state) {
        this.resetForm();
      }
    });

    this.modalService.editProduct$.subscribe(product => {
      this.editMode = !!product;
      this.editingProduct = product;
      if (product) {
        this.loadProductData(product);
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit() {
    this.files = [];
    this.uploadedFiles = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;

    this.listarVendedores();
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
    this.productForm.get('status')?.valueChanges.subscribe(value => {
      this.selectedStatus = value;
    });
    this.productForm.get('maker')?.valueChanges.subscribe(value => {
      this.selectedMaker = value;
    });
  }

  public async listarVendedores() {
    try {
      let makerResponse = await this.fabricantesService.getFabricantes();
      this.makers = makerResponse.map((maker: Fabricante) => ({
        ...maker,
        code: maker.id,
        name: maker.nombre
      }));
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error loading makers'
      });
    }
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
      name: ['', Validators.required],
      sku: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      unit: ['', Validators.required],
      alto: ['', [Validators.required, Validators.min(0)]],
      ancho: ['', [Validators.required, Validators.min(0)]],
      largo: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      maker: ['', Validators.required]
    });
  }

  private async loadProductData(product: Product) {
    // Enable SKU field by default (for new products)
    this.productForm.get('sku')?.enable();

    if (product) {
      // Disable SKU field only in edit mode
      this.productForm.get('sku')?.disable();
    }

    // Find category, brand, and unit in their respective lists
    const foundCategory = this.categories.find(
      (c) => c.id_categoria === product.categoria?.id_categoria,
    );
    const foundBrand = this.brands.find(
      (b) => b.id_marca === product.marca?.id_marca,
    );
    const foundUnit = this.units.find(
      (u) => u.id_unidad_medida === product.unidad_medida?.id_unidad_medida,
    );
    const foundMaker = this.makers.find(
      (m) => m.id?.toString() === product.id_fabricante,
    );

    // Handle existing images
    this.files = [];
    this.uploadedFiles = [];
    if (product.imagenes && Array.isArray(product.imagenes)) {
      this.uploadedFiles = product.imagenes.map((imagen: { url: string; id_imagen: string }) => ({
        name: imagen.id_imagen,
        objectURL: imagen.url,
        size: 0,
        type: 'image/*'
      }));
      console.log('Loaded images:', this.uploadedFiles);
    }

    // Update form values
    this.productForm.patchValue({
      name: product.nombre,
      sku: product.sku,
      description: product.descripcion,
      category: foundCategory,
      brand: foundBrand,
      unit: foundUnit,
      alto: product.alto,
      ancho: product.ancho,
      largo: product.largo,
      status: this.statuses.find(s => s.code === (product.activo ? 'ACTIVO' : 'INACTIVO')),
      maker: foundMaker
    });

    // Disable SKU field in edit mode
    this.productForm.get('sku')?.disable();

    // Update selected values
    this.selectedCategory = foundCategory || null;
    this.selectedBrand = foundBrand || null;
    this.selectedUnit = foundUnit || null;
    this.selectedMaker = foundMaker || null;

  }

  closeModal() {
    this.modalService.closeModal();
    this.resetForm();
  }

  resetForm() {
    this.productForm.reset();
    this.productForm.get('sku')?.enable();
    this.files = [];
    this.uploadedFiles = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.getRawValue(); // Use getRawValue to get disabled fields too
      const productToSave = {
        nombre: product.name,
        sku: product.sku,
        descripcion: product.description,
        categoria: { id_categoria: this.selectedCategory?.id_categoria || '' },
        marca: { id_marca: this.selectedBrand?.id_marca || '' },
        unidad_medida: { id_unidad_medida: this.selectedUnit?.id_unidad_medida || '' },
        pais: { id_pais: "550e8400-e29b-41d4-a716-446655440000" },
        id_fabricante: this.selectedMaker?.id?.toString() || '',
        activo: this.selectedStatus?.code === 'ACTIVO',
        precio: this.editingProduct?.precio || 0,
        alto: parseFloat(product.alto) || 0,
        ancho: parseFloat(product.ancho) || 0,
        largo: parseFloat(product.largo) || 0,
        peso: this.editingProduct?.peso || 0,
        fecha_creacion: this.editingProduct?.fecha_creacion || new Date(),
        fecha_actualizacion: new Date()
      };

      const request = this.editMode && this.editingProduct
        ? this.productsService.updateProduct(this.editingProduct.id_producto, productToSave, this.files)
        : this.productsService.saveProduct(productToSave, this.files);

      request.subscribe(
        savedProduct => {
          this.messageService.add({
            key: 'success',
            severity: 'success',
            summary: 'Éxito',
            detail: this.editMode ? 'El producto se ha actualizado correctamente' : 'El producto se ha guardado correctamente',
            life: 3000
          });
          this.eventsService.refreshProducts();
          this.closeModal();
        },
        (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.editMode ? 'Error al actualizar el producto' : 'Error al guardar el producto',
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

  uploadEvent(event: any) {
    // Handle file upload here when needed
    console.log('Upload event:', event);
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.totalSize = 0;
    this.files.forEach((file) => {
      this.totalSize += file.size;
    });
    this.totalSizePercent = Math.min(100, (this.totalSize / (1024 * 1024)) * 10);
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  onRemoveTemplatingFile(event: Event, file: any, removeFileCallback: any, index: number) {
    removeFileCallback(event, index);
    this.totalSize -= file.size;
    this.totalSizePercent = Math.min(100, (this.totalSize / (1024 * 1024)) * 10);
  }

  choose(event: Event, chooseCallback: any) {
    chooseCallback(event);
  }

  removeUploadedFile(index: number) {
    if (this.uploadedFiles && index >= 0 && index < this.uploadedFiles.length) {
      this.uploadedFiles.splice(index, 1);
    }
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

  truncateFileName(fileName: string, maxLength: number = 20): string {
    if (fileName.length <= maxLength) return fileName;

    const lastDotIndex = fileName.lastIndexOf('.');
    const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;

    const extension = hasExtension ? fileName.substring(lastDotIndex + 1) : '';
    const baseName = hasExtension ? fileName.substring(0, lastDotIndex) : fileName;

    const dots = '...';
    const extWithDot = extension ? `.${extension}` : '';
    const availableLength = maxLength - dots.length - extWithDot.length;

    const truncatedName = baseName.substring(0, Math.max(availableLength, 0));
    return `${truncatedName}${dots}${extWithDot}`;
  }

}
