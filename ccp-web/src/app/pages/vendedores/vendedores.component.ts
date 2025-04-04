import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { TagModule } from "primeng/tag";
import { VendedoresFormComponent } from "./vendedores-form/vendedores-form.component";
import { FormsModule } from "@angular/forms";
import { VendedoresService } from "../../services/vendedores/vendedores.service";
import { UsuariosService } from "../../services/usuarios/usuarios.service";
import { firstValueFrom } from "rxjs";
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
    VendedoresFormComponent,
  ],
})
export class VendedoresComponent implements OnInit {
  public vendedoresRaw: any[] = [];
  public usuariosRaw: any[] = [];
  public vendedores: any[] = [];
  public selectedVendedor: any = null;
  public dialogVisible: boolean = false;
  public loading: boolean = false;
  public filtro: string = "";

  constructor(
    private readonly vendedoresService: VendedoresService,
    private readonly usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.listarVendedores();
  }

  public async listarVendedores() {
    this.loading = true;
    try {
      this.vendedoresRaw = await this.vendedoresService.getVendedores();
      this.usuariosRaw = await firstValueFrom(
        this.usuariosService.obtenerUsuarios()
      );
      this.vendedores = this.vendedoresRaw;
      this.vendedores.forEach((vendedor) => {
        const usuario = this.usuariosRaw.find(
          (usuario) => usuario.id === vendedor.usuario_id
        );
        vendedor.estado = usuario.estado === true ? "Activo" : "Inactivo";
      });
    } finally {
      this.loading = false;
    }
  }

  public async filtrarVendedores() {
    this.vendedores = this.vendedoresRaw.filter(
      (vendedor) =>
        vendedor.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
        vendedor.correo.toLowerCase().includes(this.filtro.toLowerCase()) ||
        vendedor.telefono.toLowerCase().includes(this.filtro.toLowerCase()) ||
        vendedor.zona.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  public editVendedor(vendedor: any) {
    this.selectedVendedor = vendedor;
    this.dialogVisible = true;
  }

  public planDeVenta(vendedor: any) {
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
