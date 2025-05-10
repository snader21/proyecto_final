import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StepperModule } from "primeng/stepper";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";

import { ProductsService } from "../../../services/productos/products.service";
import { ClientesService } from "../../../services/clientes/clientes.service";
import { firstValueFrom } from "rxjs";
export interface RouteStop {
  id: string;
  nombre_cliente?: string;
  id_cliente?: string;
  id_bodega?: string;
  id_pedido?: string;
  direccion?: string;
  hora_llegada?: string;
  estado?: string;
}

@Component({
  selector: "app-rutas-details",
  standalone: true,
  imports: [CommonModule, StepperModule, DialogModule, ButtonModule],
  templateUrl: "./rutas-details.component.html",
  styleUrls: ["./rutas-details.component.scss"],
})
export class RutasDetailsComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() routeTitle: string = "Detalle de la ruta";
  @Input() ruta: any;
  @Input() stops: RouteStop[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  loading = true;
  activeStep = 1;
  bodegaMap: Record<string, any> = {};
  clienteMap: Record<string, any> = {};

  constructor(
    private readonly productosService: ProductsService,
    private readonly clientesService: ClientesService
  ) {}

  async ngOnInit() {
    await Promise.all([this.getBodegas(), this.getClientes()]);
    this.loading = false;
  }

  async getBodegas() {
    for (const stop of this.stops) {
      if (stop.id_bodega && !this.bodegaMap[stop.id_bodega]) {
        const bodega = await firstValueFrom(
          this.productosService.getBodega(stop.id_bodega)
        );
        this.bodegaMap[stop.id_bodega] = bodega;
      }
    }
  }

  async getClientes() {
    for (const stop of this.stops) {
      if (stop.id_cliente && !this.clienteMap[stop.id_cliente]) {
        const cliente = await firstValueFrom(
          this.clientesService.obtenerCliente(stop.id_cliente)
        );
        this.clienteMap[stop.id_cliente] = cliente;
      }
    }
  }

  hideDialog() {
    this.visibleChange.emit(false);
  }
}
