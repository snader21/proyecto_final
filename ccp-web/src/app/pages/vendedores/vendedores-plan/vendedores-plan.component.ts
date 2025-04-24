import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendedores-plan',
  templateUrl: './vendedores-plan.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TabViewModule,
    TableModule,
    InputTextModule,
    FormsModule
  ]
})
export class VendedoresPlanComponent {
  @Input() vendedor: any;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<boolean>();

  public activeTabIndex = 0;
  public clientesAsociados: any[] = [];
  public filtroCliente: string = '';

  constructor() {
    // Initialize with some dummy data
    this.clientesAsociados = Array(7).fill(null).map((_, i) => ({
      id: i + 1,
      nombre: 'Cliente YYY'
    }));
  }

  onDialogHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSave() {
    // Add save logic here
    this.success.emit(true);
    this.closeDialog();
  }

  filtrarClientes() {
    // Implementar lógica de filtrado
  }

  agregarCliente() {
    // Implementar lógica para agregar cliente
  }

  eliminarCliente(cliente: any) {
    // Implementar lógica para eliminar cliente
  }
}
