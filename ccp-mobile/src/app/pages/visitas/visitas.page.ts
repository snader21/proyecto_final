import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { RutasService } from '../../services/rutas.service';
import { AuthService } from '../../services/auth.service';
import { Ruta } from '../../interfaces/ruta.interface';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.page.html',
  styleUrls: ['./visitas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TranslateModule
  ],
  providers: [RutasService]
})
export class VisitasPage implements OnInit {
  rutas: Ruta[] = [];
  filteredRutas: Ruta[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  constructor(
    private rutasService: RutasService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadRutas();
  }

  async loadRutas() {
    try {
      const usuario = this.authService.getLoggedInUser();
      if (!usuario) {
        await this.showError(this.translate.instant('VISITS.MESSAGES.NO_AUTHENTICATED_SELLER'));
        this.router.navigate(['/login']);
        return;
      }

      const esVendedor = usuario.roles.some((rol: any) => rol.nombre.toLowerCase() === 'vendedor');
      if (!esVendedor) {
        await this.showError(this.translate.instant('VISITS.MESSAGES.NO_AUTHENTICATED_SELLER'));
        this.router.navigate(['/login']);
        return;
      }

      this.rutas = await this.rutasService.getRutas('visita');
      // Filtrar solo las rutas del vendedor actual
      this.rutas = this.rutas.filter(ruta => ruta.vendedor_id === usuario.id);
      this.filteredRutas = [...this.rutas];
    } catch (error) {
      console.error('Error loading routes:', error);
      await this.showError(this.translate.instant('VISITS.MESSAGES.ERROR_LOADING'));
    } finally {
      this.loading = false;
    }
  }

  async doRefresh(event: any) {
    try {
      await this.loadRutas();
    } finally {
      event.target.complete();
    }
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
    if (!searchTerm) {
      this.filteredRutas = [...this.rutas];
      return;
    }

    this.filteredRutas = this.rutas.filter(ruta => 
      ruta.nodos_rutas.some((nodo: any) => 
        nodo.direccion.toLowerCase().includes(searchTerm)
      )
    );
  }

  getBadgeColor(estado: string): string {
    switch (estado) {
      case 'Programada':
        return 'warning';
      case 'En Progreso':
        return 'primary';
      case 'Completada':
        return 'success';
      default:
        return 'medium';
    }
  }

  private async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
