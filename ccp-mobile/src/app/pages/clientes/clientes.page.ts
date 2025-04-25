import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: false
})
export class ClientesPage implements OnInit {
  public clientes: Cliente[] = [];

  constructor(private readonly router: Router, private readonly clienteService: ClienteService) { }

  ngOnInit() {
    this.obtenerClientes(null);
  }

  verDetalleCliente(clienteId: string) {
    this.router.navigate(['/clientes-detalle', clienteId]);
  }

  async obtenerClientes(vendedorId: string | null) {
    this.clientes = await firstValueFrom(this.clienteService.obtenerClientes(vendedorId));
  }
}
