import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { TagModule } from "primeng/tag";
import { FabricantesFormComponent } from "./fabricantes-form/fabricantes-form.component";
import { FabricantesService } from "../../services/fabricantes/fabricantes.service";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-vendedores",
  templateUrl: "./vendedores.component.html",
  styleUrls: ["./vendedores.component.scss"],
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
    FabricantesFormComponent,
  ],
})
export class VendedoresComponent implements OnInit {
  public vendedoresRaw: any[] = [];
  public vendedores: any[] = [];
  public selectedVendedor: any = null;
  public dialogVisible: boolean = false;
  public loading: boolean = false;
  public filtro: string = "";

  constructor(private readonly fabricantesService: FabricantesService) {}

  ngOnInit() {
    this.listarVendedores();
  }

  public async listarVendedores() {
    this.loading = true;
    try {
      this.vendedoresRaw = await this.fabricantesService.getFabricantes();
      this.vendedores = this.vendedoresRaw;
    } finally {
      this.loading = false;
    }
  }

  public async filtrarVendedores() {
    this.vendedores = this.vendedoresRaw.filter(
      (vendedor) =>
        vendedor.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
        vendedor.correo.toLowerCase().includes(this.filtro.toLowerCase()) ||
        vendedor.direccion.toLowerCase().includes(this.filtro.toLowerCase()) ||
        vendedor.telefono.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  public editVendedor(vendedor: any) {
    this.selectedVendedor = vendedor;
    this.dialogVisible = true;
  }

  public createVendedor() {
    this.selectedVendedor = null;
    this.dialogVisible = true;
  }

  public onDialogVisibilityChange(visible: boolean) {
    this.dialogVisible = visible;
  }

  public onSuccess(success: boolean) {
    if (success) {
      this.listarVendedores();
    }
  }
}
