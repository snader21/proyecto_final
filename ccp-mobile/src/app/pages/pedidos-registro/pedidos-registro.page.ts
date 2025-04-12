import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

interface Cliente {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
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

  productos: Producto[] = [
    { id: 1, nombre: 'Producto A', precio: 10000 },
    { id: 2, nombre: 'Producto B', precio: 20000 },
    { id: 3, nombre: 'Producto C', precio: 30000 },
    { id: 4, nombre: 'Producto D', precio: 40000 },
  ];

  productosFiltrados: Producto[] = [];
  productosSeleccionados: Producto[] = [];
  mediosPago = ['Efectivo', 'Tarjeta de crédito'];
  fechaMinima = new Date().toISOString();
  mostrarBusquedaProductos = false;
  mostrarCalendario = false;
  terminoBusqueda = '';

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
    this.pedidoForm = this.formBuilder.group({
      clienteId: ['', Validators.required],
      medioPago: ['', Validators.required],
      fechaEntrega: ['', Validators.required]
    });

    // Set minimum date to today
    this.fechaMinima = new Date().toISOString();
  }

  ngOnInit() {}

  buscarProductos(evento: any) {
    const termino = evento.target.value.toLowerCase();
    this.terminoBusqueda = termino;
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino)
    );
  }

  seleccionarProducto(producto: Producto) {
    if (!this.productosSeleccionados.find(p => p.id === producto.id)) {
      this.productosSeleccionados.push(producto);
    }
    this.mostrarBusquedaProductos = false;
    this.terminoBusqueda = '';
  }

  removerProducto(productoId: number) {
    this.productosSeleccionados = this.productosSeleccionados.filter(
      p => p.id !== productoId
    );
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
