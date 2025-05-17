import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { TagModule } from "primeng/tag";
import { FormsModule } from "@angular/forms";
import { RutasService } from "../../services/rutas/rutas.service";
import { RutasDetailsComponent } from "./rutas-details/rutas-details.component";
@Component({
  selector: "app-rutas",
  templateUrl: "./rutas.component.html",
  styleUrls: ["./rutas.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TableModule,
    IconField,
    InputIcon,
    TagModule,
    RutasDetailsComponent,
  ],
})
export class RutasComponent implements OnInit {
  public rutas: any[] = [];
  public selectedRuta: any = null;
  public dialogVisible: boolean = false;
  public loading: boolean = false;
  public filtro: string = "";

  constructor(private readonly rutasService: RutasService) {}

  ngOnInit() {
    this.listarRutas();
  }

  public async listarRutas() {
    this.loading = true;
    try {
      const rutas = await this.rutasService.getRutas('entrega de pedidos');
      this.rutas = rutas;

      console.log("Datos crudos:", {
        rutas,
      });
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }

  public async filtrarRutas() {
    if (!this.filtro) {
      await this.listarRutas();
      return;
    }

    const filtroLower = this.filtro.toLowerCase();
    this.rutas = this.rutas.filter(
      (ruta) =>
        ruta.numero_ruta.toString().toLowerCase().includes(filtroLower) ||
        ruta.tipo_ruta.tipo_ruta.toLowerCase().includes(filtroLower) ||
        ruta.camion.placa.toLowerCase().includes(filtroLower) ||
        ruta.fecha.toLowerCase().includes(filtroLower) ||
        ruta.estado_ruta.estado_ruta.toLowerCase().includes(filtroLower)
    );
  }

  public verDetalles(ruta: any) {
    this.selectedRuta = ruta;
    this.dialogVisible = true;
  }
}
