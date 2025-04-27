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
import { PlanesVentaService, Trimestre, PlanVentas, MetaTrimestral } from '../../../services/vendedores/planes-venta.service';
import { ClientesService, Cliente } from '../../../services/clientes/clientes.service';
import { firstValueFrom } from 'rxjs';

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
  public metasPorTrimestre: { [key: string]: number } = {};
  public planVentas: PlanVentas | null = null;

  constructor(
    private planesVentaService: PlanesVentaService,
    private clientesService: ClientesService
  ) {}

  ngOnInit() {
    if (this.visible && this.vendedor) {
      this.cargarClientesAsociados();
    }
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true && this.vendedor) {
      this.cargarClientesAsociados();
      this.cargarDatos();
    }
  }

  async cargarDatos() {
    console.log('=== INICIO cargarDatos ===');
    console.log('Vendedor:', this.vendedor);
    
    if (!this.vendedor?.id) {
      console.log('No hay vendedor o no tiene ID');
      return;
    }
    
    const currentYear = new Date().getFullYear();
    console.log('Año actual:', currentYear);

    try {
      // 1. Esperar a que se carguen los trimestres
      console.log('1. Cargando trimestres...');
      this.trimestres = await firstValueFrom(
        this.planesVentaService.getTrimestresPorAno(currentYear)
      );
      console.log('Trimestres cargados:', JSON.stringify(this.trimestres, null, 2));

      // 2. Esperar a que se cargue el plan
      console.log('2. Cargando plan de ventas...');
      const planes = await firstValueFrom(
        this.planesVentaService.getPlanVentas(this.vendedor.id, currentYear)
      );
      console.log('Planes recibidos:', JSON.stringify(planes, null, 2));

      // 3. Asignar valores
      console.log('3. Asignando valores...');
      this.metasPorTrimestre = {};
      
      // Tomamos el primer plan si existe
      const plan = Array.isArray(planes) && planes.length > 0 ? planes[0] : null;
      console.log('Plan seleccionado:', JSON.stringify(plan, null, 2));

      if (plan?.metas) {
        this.planVentas = {
          ano: plan.ano,
          idVendedor: Number(plan.idVendedor),
          metas: plan.metas
        };
        
        plan.metas.forEach(meta => {
          const valor = Number(meta.metaVenta);
          console.log(`Asignando meta para trimestre ${meta.idQ}:`, {
            valorOriginal: meta.metaVenta,
            valorConvertido: valor
          });
          this.metasPorTrimestre[meta.idQ] = valor;
        });
      } else {
        console.log('No se encontraron metas en el plan');
      }

      console.log('Estado final de metasPorTrimestre:', this.metasPorTrimestre);
      console.log('=== FIN cargarDatos ===');
    } catch (error) {
      console.error('Error en cargarDatos:', error);
      console.log('=== FIN cargarDatos con ERROR ===');
    }
  }

  cargarClientesAsociados = () => {
    if (this.vendedor && this.vendedor['usuario_id']) {
      this.clientesService.getClientesVendedor(this.vendedor['usuario_id'])
        .subscribe({
          next: (clientes) => {
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

  filtrarClientes(event: any) {
    const query = event.query.toLowerCase();
    this.clientesService.getClientesSinVendedor()
      .subscribe(clientes => {
        this.clientesFiltrados = clientes.filter(cliente =>
          cliente.nombre.toLowerCase().includes(query)
        );
      });
  }

  agregarCliente() {
    if (!this.clienteSeleccionado || !this.vendedor?.usuario_id) {
      return;
    }

    if (!this.clientesAsociados.some(c => c.id_cliente === this.clienteSeleccionado?.id_cliente)) {
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

  onSave() {
    if (!this.vendedor?.id) return;

    const currentYear = new Date().getFullYear();
    const planVentas: PlanVentas = {
      ano: currentYear,
      idVendedor: this.vendedor.id,
      metas: this.trimestres.map(trimestre => ({
        idQ: trimestre.idQ,
        ano: currentYear,
        idVendedor: this.vendedor.id,
        metaVenta: this.metasPorTrimestre[trimestre.idQ] || 0
      }))
    };

    this.planesVentaService.putMetaTrimestral(planVentas)
      .subscribe({
        next: (response) => {
          console.log('Plan de ventas guardado:', response);
          this.success.emit(true);
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error al guardar plan de ventas:', error);
        }
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
}
