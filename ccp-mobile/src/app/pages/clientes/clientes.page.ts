import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Cliente {
  id: number;
  nombre: string;
  foto: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: false
})
export class ClientesPage implements OnInit {
  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' },
    { id: 2, nombre: 'María García', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' },
    { id: 3, nombre: 'Carlos López', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' },
    { id: 4, nombre: 'Ana Martínez', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' },
    { id: 5, nombre: 'Luis Rodriguez', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {}

  verDetalleCliente(clienteId: number) {
    this.router.navigate(['/clientes-detalle', clienteId]);
  }
}
