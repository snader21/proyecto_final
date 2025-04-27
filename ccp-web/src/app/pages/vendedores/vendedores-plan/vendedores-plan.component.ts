import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges, OnChanges } from '@angular/core';
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
export class VendedoresPlanComponent implements OnInit, OnChanges {
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
    if (this.visible && this.vendedor) {
      this.cargarClientesAsociados();
    }
    this.cargarTrimestres();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true && this.vendedor) {
      console.log('Modal abierto - cargando clientes');
      this.cargarClientesAsociados();
    }
  }

  cargarClientesAsociados = () => {
    console.log('cargarClientesAsociados - vendedor:', {
      vendedor: this.vendedor,
      id: this.vendedor?.id,
      usuario_id: this.vendedor?.usuario_id,
      propiedades: this.vendedor ? Object.keys(this.vendedor) : []
    });

    if (this.vendedor && this.vendedor['usuario_id']) {
      console.log('Intentando cargar clientes con usuario_id:', this.vendedor['usuario_id']);
      this.clientesService.getClientesVendedor(this.vendedor['usuario_id'])
        .subscribe({
          next: (clientes) => {
            console.log('Clientes recibidos:', clientes);
            this.clientesAsociados = clientes;
          },
          error: (error) => {
            console.error('Error al cargar clientes:', error);
          }
        });
    } else {
      console.warn('No se encontró usuario_id en el vendedor');
    }
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
    this.clientesService.getClientesSinVendedor()
      .subscribe(clientes => {
        console.table(clientes);
        this.clientesFiltrados = clientes.filter(cliente =>
          cliente.nombre.toLowerCase().includes(query)
        );
      });
  }

  agregarCliente() {
    console.log('Cliente seleccionado: ', this.clienteSeleccionado);

    if (!this.clienteSeleccionado || !this.vendedor?.usuario_id) {
      console.error('Datos inválidos:', {
        cliente: this.clienteSeleccionado,
        vendedor: this.vendedor
      });
      return;
    }

    if (!this.clientesAsociados.some(c => c.id_cliente === this.clienteSeleccionado?.id_cliente)) {
      console.log('Intentando asociar cliente:', {
        clienteId: this.clienteSeleccionado.id_cliente,
        vendedorId: this.vendedor.usuario_id,
        vendedor: this.vendedor
      });

      this.clientesService.asignarClienteVendedor(this.clienteSeleccionado.id_cliente, this.vendedor.usuario_id)
        .subscribe(() => {
          this.cargarClientesAsociados();
          this.clienteSeleccionado = null;
        });
    }
  }

  eliminarCliente(cliente: Cliente) {
    if (!cliente.id_cliente || !this.vendedor?.usuario_id) {
      console.error('Datos inválidos para desasociar:', {
        clienteId: cliente.id_cliente,
        vendedorId: this.vendedor?.usuario_id
      });
      return;
    }

    this.clientesService.eliminarClienteVendedor(cliente.id_cliente)
      .subscribe(() => {
        this.cargarClientesAsociados();
      });
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
    console.log('Guardando cambios...');
    // Add save logic here
    this.success.emit(true);
    this.closeDialog();
  }
}
