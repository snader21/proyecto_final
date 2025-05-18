import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { EstadoPedidoService } from '../../services/estado-pedido.service';
import { firstValueFrom } from 'rxjs';
import { ClienteService } from 'src/app/services/cliente.service';
import { VendedorService } from 'src/app/services/vendedor.service';

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
  idCliente: string | null = null;
  idVendedor: string | null = null;

  constructor(
    private pedidosService: PedidosService,
    private estadoPedidoService: EstadoPedidoService,
    private clienteService: ClienteService,
    private vendedorService: VendedorService,
  ) {
    // Establecer fecha inicial un mes atrás
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 3);
    this.filtroFechaInicio = fechaInicio.toISOString().split('T')[0];
    this.filtroFechaFin = new Date().toISOString().split('T')[0];
  }

  async ngOnInit() {
    this.pedidos = [];
    this.pedidosFiltrados = [];
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    await this.cargarEstados();
    await this.cargarPedidos();
  }

  async ionViewWillEnter() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
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
          const vendedor = await firstValueFrom(this.vendedorService.obtenerVendedorByUsuario(this.usuario.id));
          this.idVendedor = vendedor.id;
          response = await firstValueFrom(this.pedidosService.getPedidosVendedor(this.idVendedor!, params));
          this.pedidos = response || [];
          break;
        case 'Cliente':
          this.idVendedor = null;
          const cliente = await firstValueFrom(this.clienteService.obtenerClientePorUsuario(this.usuario.id));
          this.idCliente = cliente[0].id_cliente;
          const data = await firstValueFrom(this.pedidosService.getPedidosCliente(this.idCliente!, params));
          this.pedidos = data || [];
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
