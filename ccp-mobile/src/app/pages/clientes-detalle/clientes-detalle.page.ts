import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Cliente {
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-clientes-detalle',
  templateUrl: './clientes-detalle.page.html',
  styleUrls: ['./clientes-detalle.page.scss'],
  standalone: false
})
export class ClientesDetallePage implements OnInit {
  mockCliente: Cliente = {
    id: "f71a420c-b78d-4af6-a14b-e0987d4757e1",
    nombre: 'Juan Pérez'
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navegarAVisita() {
    this.router.navigate(['/clientes-visita'], {
      queryParams: {
        cliente: JSON.stringify(this.mockCliente)
      }
    });
  }

}
