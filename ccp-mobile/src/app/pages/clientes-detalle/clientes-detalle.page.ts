import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';

@Component({
  selector: 'app-clientes-detalle',
  templateUrl: './clientes-detalle.page.html',
  styleUrls: ['./clientes-detalle.page.scss'],
  standalone: false
})
export class ClientesDetallePage implements OnInit {
  cliente: Cliente | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cliente = navigation.extras.state['cliente'];
    }
  }

  navegarAVisita() {
    if (this.cliente) {
      this.router.navigate(['/clientes-visita'], {
        state: { cliente: this.cliente }
      });
    }
  }
}
