import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { FabricantesFormComponent } from './fabricantes-form/fabricantes-form.component';
import { FabricantesService } from '../../services/fabricantes/fabricantes.service';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
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
    FormsModule,
    TableModule,
    IconField,
    InputIcon,
    TagModule,
    FabricantesFormComponent,
    TooltipModule,
  ],
})
export class FabricantesComponent implements OnInit {
  public fabricantesRaw: any[] = [];
  public fabricantes: any[] = [];
  public selectedFabricante: any = null;
  public dialogVisible: boolean = false;
  public loading: boolean = false;
  public filtro: string = '';

  constructor(private readonly fabricantesService: FabricantesService) { }

  ngOnInit() {
    this.listarFabricantes();
  }

  public async listarFabricantes() {
    this.loading = true;
    try {
      this.fabricantesRaw = await this.fabricantesService.getFabricantes();
      this.fabricantes = this.fabricantesRaw;
    } finally {
      this.loading = false;
    }
  }

  public async filtrarFabricantes() {
    this.fabricantes = this.fabricantesRaw.filter(fabricante =>
      fabricante.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      fabricante.correo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      fabricante.direccion.toLowerCase().includes(this.filtro.toLowerCase()) ||
      fabricante.telefono.toLowerCase().includes(this.filtro.toLowerCase())
    );
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

  public onSuccess(success: boolean) {
    if (success) {
      this.listarFabricantes();
      console.log('Fabricante guardado exitosamente');
    }
  }
}
