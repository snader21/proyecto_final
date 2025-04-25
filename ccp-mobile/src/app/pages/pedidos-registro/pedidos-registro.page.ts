import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoPedido } from '../../interfaces/producto-pedido.interface';
import { AlertController } from '@ionic/angular';
import { MetodosPagoService, MetodoPago } from '../../services/metodos-pago.service';

interface Cliente {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-pedidos-registro',
  templateUrl: './pedidos-registro.page.html',
  styleUrls: ['./pedidos-registro.page.scss'],
  standalone: false
})
export class PedidosRegistroPage implements OnInit {
  pedidoForm: FormGroup;
  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María García' },
    { id: 3, nombre: 'Carlos López' },
    { id: 4, nombre: 'Ana Martínez' },
  ];

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosSeleccionados: ProductoPedido[] = [];
  cantidadesSeleccionadas: { [key: string]: number } = {};
  mediosPago: any[] = [];
  fechaMinima = new Date().toISOString();
  mostrarBusquedaProductos = false;
  mostrarCalendario = false;
  terminoBusqueda = '';
  mostrarMensajeNoResultados = false;

  constructor(
    private productosService: ProductosService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private metodosPagoService: MetodosPagoService
  ) {
    this.pedidoForm = this.formBuilder.group({
      clienteId: ['', Validators.required],
      medioPago: ['', Validators.required],
      fechaEntrega: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.metodosPagoService.getMetodosPago().subscribe((metodos: MetodoPago[]) => {
      console.log(metodos);
      this.mediosPago = metodos;
    });
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

  async guardarPedido() {
    if (this.pedidoForm.valid && this.productosSeleccionados.length > 0) {
      const pedido = {
        ...this.pedidoForm.value,
        productos: this.productosSeleccionados
      };

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Pedido guardado correctamente',
        buttons: ['OK']
      });

      await alert.present();
      console.log('Pedido guardado:', pedido);
    }
  }
}
