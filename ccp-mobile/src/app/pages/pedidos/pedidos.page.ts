import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { EstadoPedidoService } from '../../services/estado-pedido.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: false
})
export class PedidosPage implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  estados: any[] = [];
  filtroNumeroPedido: string = '';
  filtroEstado: number = -1;
  filtroFechaInicio: string | null = null;
  filtroFechaFin: string | null = null;
  mostrarCalendario = false;
  fechaMaxima = new Date().toISOString();
  usuario: any;

  constructor(
    private pedidosService: PedidosService,
    private estadoPedidoService: EstadoPedidoService
  ) {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    // Establecer fecha inicial un mes atrás
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 3);
    this.filtroFechaInicio = fechaInicio.toISOString().split('T')[0];
    this.filtroFechaFin = new Date().toISOString().split('T')[0];
  }

  async ngOnInit() {
    await this.cargarEstados();
    await this.cargarPedidos();
  }

  async ionViewWillEnter() {
    await this.cargarPedidos();
  }

  async cargarEstados() {
    try {
      const estadosFromService = await firstValueFrom(this.estadoPedidoService.getEstados()) || [];
      this.estados = [
        { id_estado: -1, nombre: 'Todos', descripcion: 'Mostrar todos los estados' },
        ...estadosFromService
      ];
    } catch (error) {
      console.error('Error al cargar estados:', error);
      this.estados = [];
    }
  }

  async cargarPedidos() {
    try {
      const rol = this.usuario.roles[0].nombre;
      let response;

      const params = {
        ...(this.filtroNumeroPedido && { numeroPedido: this.filtroNumeroPedido }),
        ...(this.filtroEstado && this.filtroEstado !== -1 && { estado: this.filtroEstado }),
        ...(this.filtroFechaInicio && { fechaInicio: this.filtroFechaInicio }),
        ...(this.filtroFechaFin && { fechaFin: this.filtroFechaFin })
      };

      switch (rol) {
        case 'Vendedor':
          response = await firstValueFrom(this.pedidosService.getPedidosVendedor(this.usuario.id, params));
          this.pedidos = response || [];
          break;
        case 'Cliente':
          response = await firstValueFrom(this.pedidosService.getPedidosCliente(this.usuario.id, params));
          this.pedidos = response || [];
          break;
        case 'Administrador':
          response = await firstValueFrom(this.pedidosService.getAllPedidos(params));
          this.pedidos = response || [];
          break;
        default:
          this.pedidos = [];
      }

      this.pedidosFiltrados = [...this.pedidos];
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.pedidos = [];
      this.pedidosFiltrados = [];
    }
  }

  async aplicarFiltros() {
    await this.cargarPedidos();
  }

  aplicarFiltrosAsync() {
    this.aplicarFiltros().catch(error => {
      console.error('Error al aplicar filtros:', error);
    });
  }

  validarFechas(event: any, tipo: 'inicio' | 'fin') {
    const fechaSeleccionada = event.detail.value;

    if (tipo === 'inicio' && this.filtroFechaFin) {
      if (fechaSeleccionada > this.filtroFechaFin) {
        this.filtroFechaInicio = this.filtroFechaFin;
        return;
      }
    } else if (tipo === 'fin' && this.filtroFechaInicio) {
      if (fechaSeleccionada < this.filtroFechaInicio) {
        this.filtroFechaFin = this.filtroFechaInicio;
        return;
      }
    }

    if (tipo === 'inicio') {
      this.filtroFechaInicio = fechaSeleccionada;
    } else {
      this.filtroFechaFin = fechaSeleccionada;
    }
    this.aplicarFiltrosAsync();
  }

  limpiarNumeroPedido() {
    this.filtroNumeroPedido = '';
    this.aplicarFiltrosAsync();
  }
}
