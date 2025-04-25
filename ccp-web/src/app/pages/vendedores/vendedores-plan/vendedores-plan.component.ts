import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { PlanesVentaService, Trimestre } from '../../../services/vendedores/planes-venta.service';
import { ClientesService, Cliente } from '../../../services/clientes/clientes.service';

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
    InputNumberModule,
    AutoCompleteModule,
    FormsModule
  ]
})
export class VendedoresPlanComponent implements OnInit {
  @Input() vendedor: any;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<boolean>();

  public activeTabIndex = 0;
  public clientesAsociados: any[] = [];
  public clientesFiltrados: Cliente[] = [];
  public clienteSeleccionado: Cliente | null = null;
  public trimestres: Trimestre[] = [];

  constructor(
    private planesVentaService: PlanesVentaService,
    private clientesService: ClientesService
  ) {}

  ngOnInit() {
    this.cargarTrimestres();
  }

  cargarTrimestres() {
    const currentYear = new Date().getFullYear();
    this.planesVentaService.getTrimestres(currentYear)
      .subscribe(trimestres => {
        this.trimestres = trimestres;
      });
  }

  filtrarClientes(event: any) {
    const query = event.query.toLowerCase();
    this.clientesService.getClientesVendedor()
      .subscribe(clientes => {
        this.clientesFiltrados = clientes.filter(cliente => 
          cliente.nombre.toLowerCase().includes(query)
        );
      });
  }

  agregarCliente() {
    if (this.clienteSeleccionado && !this.clientesAsociados.some(c => c.id === this.clienteSeleccionado?.id)) {
      this.clientesAsociados.push(this.clienteSeleccionado);
      this.clienteSeleccionado = null;
    }
  }

  eliminarCliente(cliente: Cliente) {
    const index = this.clientesAsociados.findIndex(c => c.id === cliente.id);
    if (index > -1) {
      this.clientesAsociados.splice(index, 1);
    }
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
}
