import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { FabricantesFormComponent } from '../../components/fabricantes-form/fabricantes-form.component';

@Component({
  selector: 'app-fabricantes',
  templateUrl: './fabricantes.component.html',
  styleUrls: ['./fabricantes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    IconField,
    InputIcon,
    TagModule,
    FabricantesFormComponent
  ]
})
export class FabricantesComponent implements OnInit {
  public fabricantes: any[] = [];
  public selectedFabricante: any = null;
  public dialogVisible: boolean = false;

  constructor() { }

  ngOnInit() {
    this.fabricantes = [
      { 
        name: 'Fabricante 1', 
        email: 'fabricante1@example.com', 
        address: 'Calle Principal 123', 
        status: 'Activo', 
        phone: '300-123-4567' 
      },
      { 
        name: 'Fabricante 2', 
        email: 'fabricante2@example.com', 
        address: 'Avenida Central 456', 
        status: 'Inactivo', 
        phone: '300-987-6543' 
      },
      { 
        name: 'Fabricante 3', 
        email: 'fabricante3@example.com', 
        address: 'Carrera 789', 
        status: 'Activo', 
        phone: '300-456-7890' 
      }
    ];
  }

  public editFabricante(fabricante: any) {
    this.selectedFabricante = fabricante;
    this.dialogVisible = true;
  }

  public createFabricante() {
    this.selectedFabricante = null;
    this.dialogVisible = true;
  }

  public onDialogVisibilityChange(visible: boolean) {
    this.dialogVisible = visible;
  }

  public selectProduct(product: any) {
    console.log(product);
  }
}
