import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoPedido } from '../../interfaces/producto-pedido.interface';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { AlertController } from '@ionic/angular';
import { MetodosPagoService, MetodoPago } from '../../services/metodos-pago.service';
import { v4 as uuidv4 } from 'uuid';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { VendedorService } from 'src/app/services/vendedor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pedidos-registro',
  templateUrl: './pedidos-registro.page.html',
  styleUrls: ['./pedidos-registro.page.scss'],
  standalone: false
})
export class PedidosRegistroPage implements OnInit {
  pedidoForm: FormGroup;
  clientes: Cliente[] = [];
  idPedido: string = '';
  idUsuario: string = '';
  idCliente: string | null = null;
  idVendedor: string | null = null;
  rol: string | null = null;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosSeleccionados: ProductoPedido[] = [];
  cantidadesSeleccionadas: { [key: string]: number } = {};
  mediosPago: any[] = [];
  metodosEnvio: any[] = [];
  fechaMinima = new Date().toISOString();
  mostrarBusquedaProductos = false;
  mostrarCalendario = false;
  terminoBusqueda = '';
  mostrarMensajeNoResultados = false;
  esCliente = false;
  clienteId: string | null = null;

  constructor(
    private productosService: ProductosService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private metodosPagoService: MetodosPagoService,
    private clienteService: ClienteService,
    private pedidosService: PedidosService,
    private vendedorService: VendedorService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.pedidoForm = this.formBuilder.group({
      id_cliente: ['', Validators.required],
      medioPago: ['', Validators.required],
      fechaEntrega: ['', Validators.required],
      id_metodo_envio: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.idPedido = uuidv4();
    this.idUsuario = this.recuperarUsuario();
  }

  ionViewWillEnter() {
    this.cargarDatosIniciales();
    this.cargarMetodosPagoYEnvio();
  }

  private cargarDatosIniciales() {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const esVendedor = usuario.roles.some((rol: any) => rol.nombre.toLowerCase() === 'vendedor');
      const esCliente = usuario.roles.some((rol: any) => rol.nombre.toLowerCase() === 'cliente');

      this.esCliente = esCliente;
      if (esCliente) {
        this.clienteId = usuario.id;
        this.pedidoForm.get('id_cliente')?.setValue(usuario.id);
      }

      this.obtenerClientes(esVendedor ? usuario.id : null);
    }
  }

  async obtenerClientes(vendedorId: string | null) {
    try {
      this.clientes = await firstValueFrom(this.clienteService.obtenerClientes(vendedorId));
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  }

  recuperarUsuario = (): string =>{
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      this.rol = usuario.roles[0].nombre;
      if(this.rol === 'Administrador'){
        this.idVendedor = null;
      }else if(this.rol === 'Cliente'){
        this.idVendedor = null;
        this.clienteService.obtenerClientePorUsuario(usuario.id).subscribe((cliente) => {
          this.idCliente = cliente[0].id_cliente;
        });
      }else if(this.rol === 'Vendedor'){
        this.vendedorService.obtenerVendedorByUsuario(usuario.id).subscribe((vendedor) => {
          this.idVendedor = vendedor.id;
        });
      }
      return usuario.id;
    }
    return '';
  }

  async buscarProductos(evento: any) {
    const termino = evento.target.value;
    this.terminoBusqueda = termino;
    this.mostrarMensajeNoResultados = false;

    if (termino.length < 3) {
      this.productosFiltrados = [];
      return;
    }

    try {
      const productos = await this.productosService.getInventario(termino).toPromise();
      this.productosFiltrados = productos || [];
      this.mostrarMensajeNoResultados = this.productosFiltrados.length === 0;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      this.productosFiltrados = [];
      this.mostrarMensajeNoResultados = false;
    }
  }

  agregarProducto(producto: Producto, cantidad: number) {
    if (!this.productosSeleccionados.find(p => p.id_producto === producto.id_producto)) {
      const productoPedido: ProductoPedido = {
        ...producto,
        cantidad_seleccionada: cantidad
      };
      this.productosSeleccionados.push(productoPedido);

      // Llamada al orquestador para pre-reserva
      const preReservaDto = {
        idPedido: this.idPedido,
        idUsuario: this.idUsuario,
        idProducto: producto.id_producto,
        cantidad: cantidad,
        fechaRegistro: new Date().toISOString()
      };
      this.productosService.crearPreReserva(preReservaDto).subscribe({
        next: (resp) => {
          // Manejar respuesta si es necesario
        },
        error: (err) => {
          console.error('Error creando pre-reserva:', err);
        }
      });
    }
    this.terminoBusqueda = '';
    this.productosFiltrados = [];
    this.cantidadesSeleccionadas = {};
  }

  eliminarProducto(producto: Producto) {
    this.productosSeleccionados = this.productosSeleccionados.filter(
      p => p.id_producto !== producto.id_producto
    );
  }

  calcularTotal(): number {
    return this.productosSeleccionados.reduce(
      (total, producto) => total + (producto.precio * producto.cantidad_seleccionada),
      0
    );
  }

  actualizarCantidad(producto: Producto, event: any) {
    const cantidad = parseInt(event.target.value, 10);
    if (cantidad > 0 && cantidad <= producto.inventario) {
      this.cantidadesSeleccionadas[producto.id_producto] = cantidad;
    }
  }

  // Constante base para el costo de envío por unidad
  private readonly COSTO_ENVIO_BASE = 5;

  calcularCostoEnvio(): number {
    // Suma la cantidad total de unidades de todos los productos seleccionados
    const totalUnidades = this.productosSeleccionados.reduce((acc, prod) => acc + (prod.cantidad_seleccionada || 1), 0);
    return totalUnidades * this.COSTO_ENVIO_BASE;
  }

  async guardarPedido() {
    if (this.pedidoForm.valid && this.productosSeleccionados.length > 0) {
      const pedido = {
        id_pedido: this.idPedido,
        id_vendedor: this.idVendedor,
        fecha_registro: new Date().toISOString(),
        id_estado: 2,
        descripcion: this.translate.instant('ORDER_REGISTRATION.FORM.ORDER_DESCRIPTION', { count: this.productosSeleccionados.length }),
        id_cliente: this.idCliente == null ? this.pedidoForm.value.id_cliente : this.idCliente,
        id_metodo_pago: this.pedidoForm.value.medioPago,
        estado_pago: 'Pendiente',
        costo_envio: this.calcularCostoEnvio(),
        id_metodo_envio: this.pedidoForm.value.id_metodo_envio
      };

      try {
        await this.pedidosService.createPedido(pedido).toPromise();
        const alert = await this.alertController.create({
          header: this.translate.instant('ORDER_REGISTRATION.ALERTS.SUCCESS.TITLE'),
          message: this.translate.instant('ORDER_REGISTRATION.ALERTS.SUCCESS.MESSAGE'),
          buttons: ['OK']
        });
        await alert.present();
        await alert.onDidDismiss();
        this.pedidoForm.reset();
        this.productosSeleccionados = [];
        this.cantidadesSeleccionadas = {};
        this.idPedido = uuidv4();
        this.router.navigate(['/pedidos']);
      } catch (error) {
        const alert = await this.alertController.create({
          header: this.translate.instant('ORDER_REGISTRATION.ALERTS.ERROR.TITLE'),
          message: this.translate.instant('ORDER_REGISTRATION.ALERTS.ERROR.MESSAGE'),
          buttons: ['OK']
        });
        await alert.present();
        console.error('Error al guardar pedido:', error);
      }
    } else {
      const alert = await this.alertController.create({
        header: this.translate.instant('ORDER_REGISTRATION.VALIDATION.REQUIRED_FIELDS'),
        message: this.translate.instant('ORDER_REGISTRATION.VALIDATION.SELECT_PRODUCTS'),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  private cargarMetodosPagoYEnvio() {
    this.metodosPagoService.getMetodosPago().subscribe((metodos: MetodoPago[]) => {
      this.mediosPago = metodos;
    });
    this.pedidosService.getMetodosEnvio().subscribe((metodos: any[]) => {
      this.metodosEnvio = metodos;
    });
  }
}
