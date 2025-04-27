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
import { VendedoresPlanComponent } from "./vendedores-plan/vendedores-plan.component";
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
    VendedoresPlanComponent,
  ],
})
export class VendedoresComponent implements OnInit {
  public vendedores: any[] = [];
  public selectedVendedor: any = null;
  public dialogVisible: boolean = false;
  public planVentasVisible: boolean = false;
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
      const vendedores = await this.vendedoresService.getVendedores();
      const usuarios = await firstValueFrom(this.usuariosService.obtenerUsuarios());

      console.log('Datos crudos:', {
        vendedores,
        usuarios
      });

      this.vendedores = vendedores.map(vendedor => {
        const usuario = usuarios.find(u => u.id === vendedor.usuario_id);
        console.log('Mapeando vendedor:', {
          vendedor,
          usuario,
          usuario_id: vendedor.usuario_id
        });

        return {
          ...vendedor,
          estado: usuario?.estado === true ? "Activo" : "Inactivo"
        };
      });

      console.log('Vendedores procesados:', this.vendedores);
    } catch (error) {
      console.error('Error al cargar vendedores:', error);
    } finally {
      this.loading = false;
    }
  }

  public async filtrarVendedores() {
    if (!this.filtro) {
      await this.listarVendedores();
      return;
    }

    const filtroLower = this.filtro.toLowerCase();
    this.vendedores = this.vendedores.filter(vendedor =>
      vendedor.nombre.toLowerCase().includes(filtroLower) ||
      vendedor.correo.toLowerCase().includes(filtroLower) ||
      vendedor.telefono.toLowerCase().includes(filtroLower) ||
      vendedor.zona.nombre.toLowerCase().includes(filtroLower)
    );
  }

  public editVendedor(vendedor: any) {
    this.selectedVendedor = vendedor;
    this.dialogVisible = true;
  }

  public planDeVenta(vendedor: any) {
    console.log('Plan de venta - vendedor recibido:', vendedor);
    this.selectedVendedor = vendedor;
    console.log('Plan de venta - selectedVendedor:', this.selectedVendedor);
    this.planVentasVisible = true;
  }

  public createVendedor() {
    this.selectedVendedor = null;
    this.dialogVisible = true;
  }

  public onSuccess(success: boolean) {
    this.dialogVisible = false;
    if (success) {
      this.listarVendedores();
    }
  }

  public onPlanSuccess(success: boolean) {
    if (success) {
      this.listarVendedores();
    }
  }

  public onPlanVisibleChange(visible: boolean) {
    this.planVentasVisible = visible;
  }
}
